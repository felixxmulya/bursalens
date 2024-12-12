import requests
from bs4 import BeautifulSoup
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define the months mapping
months = {
    'Jan': 'Januari', 'Feb': 'Februari', 'Mar': 'Maret', 'Apr': 'April',
    'Mei': 'Mei', 'Jun': 'Juni', 'Jul': 'Juli', 'Agu': 'Agustus',
    'Sep': 'September', 'Okt': 'Oktober', 'Nov': 'November', 'Des': 'Desember'
}

# Function to convert time strings like "2 jam yang lalu"
def get_date_from_time_ago(time_string):
    now = datetime.now()
    if "detik yang lalu" in time_string:
        seconds = int(time_string.split()[0])
        return now.strftime('%Y-%m-%d %H:%M')
    elif "menit yang lalu" in time_string:
        minutes = int(time_string.split()[0])
        now = now.replace(minute=now.minute - minutes)
        return now.strftime('%Y-%m-%d %H:%M')
    elif "jam yang lalu" in time_string:
        hours = int(time_string.split()[0])
        now = now.replace(hour=now.hour - hours)
        return now.strftime('%Y-%m-%d %H:%M')
    return now.strftime('%Y-%m-%d %H:%M')

# Function to scrape the main page data
def get_data(category):
    base_url = "https://www.liputan6.com"
    url = f"{base_url}/{category.lower()}"
    results = []

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        articles = soup.select(".articles--iridescent-list article")
        for article in articles:
            title = article.select_one('.articles--iridescent-list--text-item__title-link-text').get_text(strip=True)
            time = article.select_one('.articles--iridescent-list--text-item__time').get_text(strip=True)
            image_elem = article.select_one('picture img')
            image_thumbnail = None

            if image_elem:
                image_thumbnail = image_elem.get('data-src') or image_elem.get('src')

            # Fallback if the image is a placeholder
            if image_thumbnail and "blank.png" in image_thumbnail:
                image_thumbnail = "No Image"
            link = article.select_one('h4 a')['href']
            slug = link.replace(base_url, "")

            # Convert time using the provided month names
            time_parts = time.split()
            if len(time_parts) > 1 and time_parts[1] in months:
                time_parts[1] = months[time_parts[1]]
            formatted_time = ' '.join(time_parts).replace(" WIB", "")

            try:
                new_time = datetime.strptime(formatted_time, '%d %B %Y %H:%M').strftime('%Y-%m-%d %H:%M')
            except ValueError:
                new_time = get_date_from_time_ago(time)

            # Store the scraped data
            results.append({
                'title': title,
                'image_thumbnail': image_thumbnail,
                'time': new_time,
                'link': link,
                'slug': slug
            })

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

    return results

# Function to get detailed article content
def get_detail(slug):
    url = f"https://m.liputan6.com/{slug}?page=all"
    result = {}

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        title = soup.select_one(".article-header__title")
        content = soup.select_one(".article-content-body").get_text(separator="\n", strip=True)
        image_elem = soup.select_one(".article-photo-gallery--item__content img")
        image = image_elem['src'] if image_elem else None
        time_text = soup.select_one(".article-header__datetime")

        time_elem = soup.select_one(".article-header__datetime")
        time_text = time_elem.get_text().replace(" pada ", "") if time_elem else ""
        # Only split if time_text is not empty
        time_parts = time_text.split() if time_text else []

        if len(time_parts) > 1 and time_parts[1] in months:
            time_parts[1] = months[time_parts[1]]
        try:
            new_time = datetime.strptime(' '.join(time_parts), '%d %B %Y, %H:%M').strftime('%Y-%m-%d %H:%M')
        except ValueError:
            new_time = time_text

        # Extract media content
        medias = []
        embeds = soup.select("iframe")
        for embed in embeds:
            medias.append({'type': 'embed', 'url': embed['src']})

        imgs = soup.select("img")
        for img in imgs:
            img_url = img.get('data-src')
            if img_url and "blank" not in img_url and ".gif" not in img_url:
                medias.append({'type': 'image', 'url': img_url})

        articles = soup.select("article a")
        for article in articles:
            article_url = article['href']
            medias.append({'type': 'article', 'url': article_url})

        # Store the detailed content
        result = {
            'title': title,
            'content': content,
            'image': image,
            'time': new_time,
            'media': medias
        }

    except requests.exceptions.RequestException as e:
        print(f"Error fetching detail: {e}")
        result = {'error': str(e)}

    return result

@app.route('/summary', methods=['GET'])
def get_summary():
    category = request.args.get('category', 'saham')  # Default category is 'saham'
    data = get_data(category)
    summary = [{"article": i + 1, "data": article} for i, article in enumerate(data[:102])]
    return jsonify(summary)

@app.route('/details', methods=['GET'])
def get_article_detail():
    category = request.args.get('category', 'saham')  # Default category is 'saham'
    data = get_data(category)
    if data:
        detail = get_detail(data[0]['slug'])
        return jsonify(detail)
    return jsonify({"error": "No articles found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001', debug=True)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[400px] bg-white rounded-lg shadow-md">
      <FontAwesomeIcon 
        icon={faSpinner} 
        className="h-8 w-8 text-blue-600 animate-spin" 
      />
    </div>
  );
}
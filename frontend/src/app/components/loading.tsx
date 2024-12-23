import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FontAwesomeIcon 
        icon={faSpinner}
        className="h-16 w-16 text-blue-600 animate-spin" 
      />
      <p className="text-2xl text-gray-800 mt-4">Loading..</p>
    </div>
  );
}
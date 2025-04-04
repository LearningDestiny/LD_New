import { useRef } from "react";
import { FaTrash , FaImage } from "react-icons/fa";

export default function DialogMiniImage(props) {
  const { state, setState, handleImageChange  } = props;
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleReplaceImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
        Image *
      </label>
      {/* Always render the file input */}
      <input
        type="file"
        id="image"
        name="imageFile"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden" // Hide the input element
        accept="image/*"
        
      />
      {state.imageUrl && (
        <div className="mt-2 rounded-md border shadow px-3 py-2 w-full flex  items-start">
         <div
            className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  mr-2"
            style={{ padding: "0.41rem" }}
          >
            <FaImage
              className="text-xs cursor-pointer"
            />
          </div>
          <div className="flex items-start justify-between w-full">
          <div className="col">
              <p className="text-gray-700 text-xs font-bold mb-1 ml-2">
                {/* The file name should not be more than 10 characters if its less than 10 character add "..."*/}
               


               File Name :  {state.imageUrl.split("/").pop().length > 10
                    ? `${state.imageUrl.split("/").pop().substring(0, 10)}...`
                    : state.imageUrl.split("/").pop()}
              </p>
              {/* Replace Image Text */}
              <p
                className="text-blue-500 text-xs ml-2 cursor-pointer"
                onClick={handleReplaceImageClick} // Trigger the file input click
              >
                Replace Image
              </p>
            </div>
            <a href={state.imageUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={state.imageUrl}
                alt="Event"
                className="w-10 h-10 object-cover rounded-md cursor-pointer"
              />
            </a>
            
          </div>
          
        </div>
      )}
      {!state.imageUrl && (
        <p className="text-blue-500 text-xs cursor-pointer" onClick={handleReplaceImageClick}>
          Upload Image
        </p>
      )}
    </>
  );
}
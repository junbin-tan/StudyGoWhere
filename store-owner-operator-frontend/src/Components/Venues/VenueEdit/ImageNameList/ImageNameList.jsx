import React, { useState } from 'react';

function ImageNameList() {
    const [imageNames, setImageNames] = useState([
        'Image 1',
        'Image 2',
        'Image 3',
        // Add more image names here
    ]);

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData('index', index);
        e.dataTransfer.dropEffect = "move"
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.target.style.backgroundColor = 'lightblue';
    }
    const handleDragLeave = (e) => {
        e.preventDefault();
        // Reset the background color when the mouse leaves the element
        e.target.style.backgroundColor = ''; // This removes the custom background color
    };

    const handleDrop = (e, newIndex) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('index');

        // Create a copy of the image names array and reorder it
        const newImageNames = [...imageNames];
        const [draggedName] = newImageNames.splice(draggedIndex, 1);
        newImageNames.splice(newIndex, 0, draggedName);

        // Update the state with the new order of image names
        setImageNames(newImageNames);
        console.log(newImageNames);
        e.target.style.backgroundColor = ''; // This removes the custom background color
        e.target.style.cursor = "grab";
    };

    return (
        <div className="image-name-list">
            {imageNames.map((imageName, index) => (
                <div
                    key={index}
                    draggable="true"
                    style={{cursor: "grab"}}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={e => handleDragEnter(e, index)}
                    onDragLeave={(e) => handleDragLeave(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className="image-name-item"
                >
                    {imageName}
                </div>
            ))}
        </div>
    );
}

export default ImageNameList;

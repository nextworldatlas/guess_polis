import React, { useState, useRef } from 'react';

export function CityImage({ city }) {
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 4));
    const handleZoomOut = () => {
        setZoom(z => {
            const newZoom = Math.max(z - 0.5, 1);
            if (newZoom === 1) setPosition({ x: 0, y: 0 });
            return newZoom;
        });
    };
    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) handleZoomIn();
        else handleZoomOut();
    };

    return (
        <div className="city-image-wrapper">
            <div
                className="city-image-container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
                {loading && <div className="loading-spinner">Loading satellite view...</div>}
                {city && (
                    <img
                        src={import.meta.env.BASE_URL + city.imagePath.replace(/^\//, '')}
                        alt="Satellite view of mystery city"
                        className={`city-image ${loading ? 'hidden' : ''}`}
                        onLoad={() => setLoading(false)}
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            transformOrigin: 'center center',
                        }}
                        draggable={false}
                    />
                )}
            </div>
            <div className="zoom-controls">
                <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">+</button>
                <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">−</button>
                <button onClick={handleReset} className="zoom-btn reset" title="Reset">⟲</button>
            </div>
        </div>
    );
}

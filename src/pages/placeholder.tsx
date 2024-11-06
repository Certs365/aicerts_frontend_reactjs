import React, { useState, useEffect } from 'react';
import PlaceholderPosition from "../components/placeholderPosition";
import { createPdfFromImage } from '@/utils/reusableFunctions';
import imgBg from "../../public/backgrounds/Certificate_template_1.png"
// Define the type for each placeholder
type PlaceholderType = {
    show: boolean;
    xpos: number;
    ypos: number;
    width: number;
    height: number;
    isLocked: boolean;
};

// Define the type for the placeholders object
type Placeholders = {
    CertificateNumber: PlaceholderType;
    CourseName: PlaceholderType;
    Name: PlaceholderType;
    IssueDate: PlaceholderType;
    ExpirationDate: PlaceholderType;
    QrCode: PlaceholderType;
};

// Props type for the Placeholder component
interface PlaceholderProps {
    file: string;
}

const Placeholder: React.FC<PlaceholderProps> = () => {
    // Initialize the placeholders state with default values
    const [file, setFile] = useState<string>('');

    useEffect(() => {
        const generatePdf = async () => {
            const pdfFile = await createPdfFromImage("/backgrounds/Certificate_template_1.png"); // Adjust this function to handle PNG
            setFile(pdfFile);
        };
        generatePdf();
    }, [imgBg]);

    const [placeholders, setPlaceholders] = useState<Placeholders>({
        CertificateNumber: { show: true, xpos: 100, ypos: 100, width: 200, height: 50, isLocked: false },
        CourseName: { show: true, xpos: 100, ypos: 200, width: 300, height: 50, isLocked: false },
        Name: { show: true, xpos: 100, ypos: 300, width: 250, height: 50, isLocked: false },
        IssueDate: { show: true, xpos: 100, ypos: 400, width: 200, height: 50, isLocked: false },
        ExpirationDate: { show: true, xpos: 100, ypos: 500, width: 200, height: 50, isLocked: false },
        QrCode: { show: true, xpos: 100, ypos: 600, width: 100, height: 100, isLocked: false }
    });
    

    // Handle show/hide change for each placeholder
    const handleShowChange = (key: keyof Placeholders) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlaceholders(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                show: e.target.value === 'true' // Toggle the show property based on selection
            }
        }));
    };

    // Handle lock/unlock toggle for each placeholder
    const handleLockToggle = (key: keyof Placeholders) => () => {
        setPlaceholders(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                lock: !prev[key].lock // Toggle lock state
            }
        }));
    };

    return (
        <div>
            <div style={{height:"10px"}}>

            </div>
            {/* <h2>Placeholder Controls</h2>
            <div>
                {Object.keys(placeholders).map((key) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <label>{key}:</label>
                        <select value={placeholders[key as keyof Placeholders].show.toString()} onChange={handleShowChange(key as keyof Placeholders)}>
                            <option value="true">Show</option>
                            <option value="false">Hide</option>
                        </select>
                        <button onClick={handleLockToggle(key as keyof Placeholders)}>
                            {placeholders[key as keyof Placeholders].lock ? 'Unlock' : 'Lock'}
                        </button>
                    </div>
                ))}
            </div> */}

            {/* Pass file, placeholders, and setPlaceholders to the DisplayPdf component */}
            <PlaceholderPosition
                fileUrl={file}
                scale={1} // You can dynamically adjust scale if needed
                placeholders={placeholders} // Pass the placeholders state
                setPlaceholders={setPlaceholders} // Pass setPlaceholders function
            />
        </div>
    );
};

export default Placeholder;
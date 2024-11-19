import React, { useState } from 'react';
import Button from '../../../shared/button/button';
import { useRouter } from 'next/router';

const Form = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
  });
  const router = useRouter();

  const [extraFields, setExtraFields] = useState<{ name: string; value: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddField = () => {
    if (extraFields.length < 3) {
      setExtraFields([...extraFields, { name: '', value: '' }]);
    }
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedFields = [...extraFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setExtraFields(updatedFields);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Badge Details</h2>
      <form className="p-4 border rounded shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Title of Badge */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title of Badge
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Enter badge title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        {/* Short Description */}
        <div className="mb-3">
          <label htmlFor="subtitle" className="form-label">
            Short Description
          </label>
          <input
            type="text"
            className="form-control"
            id="subtitle"
            name="subtitle"
            placeholder="Enter short description"
            value={formData.subtitle}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={4}
            placeholder="Enter detailed description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Dynamically added fields */}
        {extraFields.map((field, index) => (
          <div key={index} className="mb-3">
            <label htmlFor={`fieldName-${index}`} className="form-label">
              Field Name
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id={`fieldName-${index}`}
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            />
            <label htmlFor={`fieldValue-${index}`} className="form-label">
              Field Value
            </label>
            <input
              type="text"
              className="form-control"
              id={`fieldValue-${index}`}
              placeholder="Field Value"
              value={field.value}
              onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            />
          </div>
        ))}

        {/* Add Field Button */}
        {extraFields.length < 3 && (
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddField}
            >
              Add Field
            </button>
          </div>
        )}
        <Button onClick={() => handleNavigate('/badge-designer')} className='golden' label='Submit' />
      </form>
    </div>
  );
};

export default Form;

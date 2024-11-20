import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '../../../shared/button/button';
import certificate from '@/services/certificateServices';

const BadgeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
  });
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const fetchBadgeDetails = async () => {
    try {
      if (id) {
        setIsLoading(true);

        certificate.getBadgeTemplateDetails(id, (response) => {
          if (response.status === 'SUCCESS') {
            const { title, subTitle, description, attributes } = response?.data?.data;
            setFormData({
              title: title || '',
              subtitle: subTitle || '',
              description: description || '',
            });

            setAttributes(attributes|| []);
          } else {
            console.error('Failed to fetch badge details:', response.error || 'Unknown error');
            setFormData({ title: '', subtitle: '', description: '' });
            setAttributes([]);
          }

          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching badge details:', error);
      setFormData({ title: '', subtitle: '', description: '' });
      setAttributes([]);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = () => {
    setAttributes((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributes(updatedAttributes);
  };

  const handleRemoveField = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        setIsLoading(true);
  
        // Using the certificate service for updating
        certificate.updateBadgeTemplate({ ...formData,id, attributes }, (response) => {
          if (response.status === 'SUCCESS') {
            console.log('Badge updated successfully');
            router.push(`/badge-designer?id=${id}`); // Navigate on success
          } else {
            console.error('Failed to update badge:', response.error || 'Unknown error');
          }
  
          setIsLoading(false);
        });
      } else {
        setIsLoading(true);
  
        // Using the certificate service for creating
        certificate.addBadgeTemplate({ ...formData, attributes }, (response) => {
          if (response.status === 'SUCCESS') {
            console.log('Badge created successfully');
            router.push(`/badge-designer?id=${response?.data?.data._id}`); // Navigate on success
          } else {
            console.error('Failed to create badge:', response.error || 'Unknown error');
          }
  
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Unexpected error submitting badge form:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadgeDetails();
  }, [id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Badge Details</h2>
      <form className="p-4 border rounded shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Enter badge title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Subtitle */}
        <div className="mb-3">
          <label htmlFor="subtitle" className="form-label">Subtitle</label>
          <input
            type="text"
            className="form-control"
            id="subtitle"
            name="subtitle"
            placeholder="Enter subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={4}
            placeholder="Enter detailed description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Attributes */}
        <h5 className="mt-4">Custom Fields</h5>
        {attributes.map((attr, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex gap-3">
              <input
                type="text"
                className="form-control"
                placeholder="Key"
                value={attr.key}
                onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                disabled={isLoading}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Value"
                value={attr.value}
                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemoveField(index)}
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Field Button */}
        <button
          type="button"
          className="btn btn-primary mb-4"
          onClick={handleAddField}
          disabled={isLoading}
        >
          Add Field
        </button>

        {/* Submit Button */}
        <Button onClick={(e)=>{handleSubmit(e)}} className="golden" label={id ? 'Update' : 'Submit'} />
      </form>
    </div>
  );
};

export default BadgeForm;

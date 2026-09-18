import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, Plus, X, Trash2, ListFilter } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';


export default function AdminVehicleUpload({ onVehicleAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Luxury Bus',
    seats: '',
    luggage: '',
    description: '',
    tag: 'MOST POPULAR'
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [dbVehicles, setDbVehicles] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchDbVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vehicles`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDbVehicles(data.data);
      }
    } catch (err) {
      console.log('Error fetching vehicles list for admin:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbVehicles();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setStatus({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WEBP).' });
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus({ type: '', message: '' });
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteVehicle = async (vehicleId, vehicleName) => {
    if (!window.confirm(`Are you sure you want to delete "${vehicleName}"?`)) {
      return;
    }

    setDeletingId(vehicleId);
    try {
      const res = await fetch(`${API_BASE}/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setStatus({ type: 'success', message: `Deleted "${vehicleName}" successfully!` });
        fetchDbVehicles();
        if (onVehicleAdded) onVehicleAdded();
      } else {
        throw new Error(result.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error deleting vehicle' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus({ type: 'error', message: 'Please select a photo for the vehicle!' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 1. Upload Image File to Express Multer server
      const uploadData = new FormData();
      uploadData.append('image', imageFile);

      const uploadRes = await fetch(`${API_BASE}/api/vehicles/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      const uploadResult = await uploadRes.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Image upload failed');
      }

      // 2. Save Vehicle details with the returned image path in MongoDB
      const newVehiclePayload = {
        ...formData,
        image: uploadResult.imageUrl, // e.g. /uploads/1234.jpg
      };

      const vehicleRes = await fetch(`${API_BASE}/api/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehiclePayload),
      });

      const vehicleResult = await vehicleRes.json();

      if (vehicleResult.success) {
        setStatus({
          type: 'success',
          message: `Vehicle "${formData.name}" and photo uploaded successfully!`
        });
        // Reset form
        setFormData({
          name: '',
          category: 'Luxury Bus',
          seats: '',
          luggage: '',
          description: '',
          tag: 'MOST POPULAR'
        });
        handleRemoveImage();
        fetchDbVehicles();
        if (onVehicleAdded) {
          onVehicleAdded();
        }
      } else {
        throw new Error(vehicleResult.message || 'Could not save vehicle');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Network error while uploading. Please ensure server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-950/80 text-red-400 border border-red-800/40 uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">Add & Manage Fleet Photos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Add Fleet Vehicle & Photo</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition self-start sm:self-auto"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isOpen ? 'Close Admin' : 'Add New Vehicle'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 pt-2">
          {status.message && (
            <div
              className={`mb-6 p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 border ${
                status.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                  Vehicle Name / Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Sadguru Volvo Multi-Axle (MH 04 GP 7877)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Luxury Bus">Luxury Bus</option>
                  <option value="Tempo Traveler">Tempo Traveler</option>
                  <option value="Premium Sedan">Premium Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Minibus">Minibus</option>
                </select>
              </div>

              {/* Tag / Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                  Display Tag / Badge
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  placeholder="e.g. MOST POPULAR, NEW, FAMILY FAVORITE"
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500"
                />
              </div>

              {/* Seats & Luggage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                    Seats
                  </label>
                  <input
                    type="text"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    placeholder="e.g. 35-45 Seats"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                    Luggage
                  </label>
                  <input
                    type="text"
                    name="luggage"
                    value={formData.luggage}
                    onChange={handleInputChange}
                    placeholder="e.g. Large Hold"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Vehicle Features & Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Comfortable AC sleeper coach, pushback seats, ambient lights, sound system..."
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500"
              ></textarea>
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Vehicle Photo <span className="text-red-500">*</span>
              </label>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-red-500/80 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-8 text-center cursor-pointer transition duration-300 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/40 text-red-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Click to select or drop a vehicle photo</p>
                  <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP up to 10MB</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-3 max-w-md">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[200px]">
                      {imageFile?.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-red-600/30 text-sm flex items-center justify-center gap-2 min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading & Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Save & Publish Vehicle
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Manage Existing Uploaded Vehicles */}
          {dbVehicles.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-red-400" /> Uploaded Database Vehicles ({dbVehicles.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dbVehicles.map((veh) => (
                  <div
                    key={veh._id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={veh.image?.startsWith('/uploads') ? `${API_BASE}${veh.image}` : veh.image}
                        alt={veh.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate">{veh.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{veh.category}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={deletingId === veh._id}
                      onClick={() => handleDeleteVehicle(veh._id, veh.name)}
                      className="p-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-xs transition flex-shrink-0"
                      title="Delete this vehicle"
                    >
                      {deletingId === veh._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

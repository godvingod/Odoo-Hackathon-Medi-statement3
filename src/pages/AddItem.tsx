import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== FORM SUBMIT CLICKED ===");
    console.log("Form event:", e);
    
    setError("");
    setLoading(true);
    
    console.log("=== FORM SUBMISSION START ===");
    console.log("User ID:", user?.id);
    console.log("User object:", user);
    console.log("Form data:", { title, desc, category, type, size, condition, tags });

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error("Form submission timed out after 10 seconds");
      setError("Form submission timed out. Please try again.");
      setLoading(false);
    }, 10000);

    try {
      // Test database connection first
      console.log("Testing database connection...");
      const { data: testData, error: testError } = await supabase
        .from("items")
        .select("id")
        .limit(1);
      
      if (testError) {
        console.error("Database connection test failed:", testError);
        setError(`Database connection failed: ${testError.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      console.log("Database connection successful");

      // Skip image upload for now to test basic insert
      console.log("Preparing item data for insert...");
      const itemData = {
        uploader_id: user.id,
        title,
        description: desc,
        category,
        type,
        size,
        condition,
        tags: tags ? tags.split(",").map(s => s.trim()).filter(s => s.length > 0) : [],
        images: [] // Skip images for now
      };
      
      console.log("Item data to insert:", itemData);

      console.log("Attempting to insert item...");
      const { data, error: insertError } = await supabase.from("items").insert([itemData]);
      
      if (insertError) {
        console.error("Database insert error:", insertError);
        console.error("Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        setError(`Failed to add item: ${insertError.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      
      console.log("Item inserted successfully:", data);
      setLoading(false);
      clearTimeout(timeoutId);
      alert("Item added successfully!");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Unexpected error:", err);
      console.error("Error stack:", err instanceof Error ? err.stack : 'No stack trace');
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  // Test if the component is rendering properly
  console.log("AddItem component rendered, user:", user?.id);

  if (!user) {
    return <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="text-red-600">Please log in to add items.</div>
    </div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          disabled={loading}
        />
        <textarea 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Description" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          required 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          required 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Type (e.g. Shirt)" 
          value={type} 
          onChange={e => setType(e.target.value)} 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Size" 
          value={size} 
          onChange={e => setSize(e.target.value)} 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Condition" 
          value={condition} 
          onChange={e => setCondition(e.target.value)} 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          placeholder="Tags (comma separated)" 
          value={tags} 
          onChange={e => setTags(e.target.value)} 
          disabled={loading}
        />
        <input 
          className="w-full mb-3 p-2 border rounded" 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={e => setImages(e.target.files)} 
          disabled={loading}
        />
        <button 
          className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-green-600'}`} 
          type="submit"
          disabled={loading}
          onClick={() => console.log("Button clicked!")}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <div className="text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">{error}</div>}
      </form>
      
      {/* Debug info */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <div><strong>Debug Info:</strong></div>
        <div>User ID: {user?.id || 'Not set'}</div>
        <div>Loading state: {loading ? 'true' : 'false'}</div>
        <div>Error state: {error || 'none'}</div>
      </div>
    </div>
  );
}
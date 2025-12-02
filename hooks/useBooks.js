 pro// hooks/useBooks.js
import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

export function useBooks() {
  const [loading, setLoading] = useState(false);

  // GET all books
  const getBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/buku'));
      const data = await res.json();
      return data.success ? data.data : (Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // GET book by ID
  const getBook = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/buku/${id}`));
      const data = await res.json();
      return data.success ? data.data : (data.id ? data : null);
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // POST - Create book
  const createBook = async (formData) => {
    try {
      setLoading(true);

      // Debug log
      console.log('📤 Creating book with FormData:');
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]);
      }

      const res = await fetch(getApiUrl('/api/buku'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Debug response
      console.log('📥 Response:', data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to create book');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating book:', error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // PUT - Update book
  const updateBook = async (id, formData) => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/buku/${id}`), {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to update book');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating book:', error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // DELETE book
  const deleteBook = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/buku/${id}`), {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete book');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting book:', error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
  };
}
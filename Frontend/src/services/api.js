const API_BASE_URL = 'http://localhost:8000';


export async function summarizeContent(text, files) {
  try {
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    } else {
      formData.append('text', text);
    }

    console.log('Making request to:', `${API_BASE_URL}/summarize`);
    
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please make sure the backend is running on http://localhost:8000');
    }
    throw error;
  }
}

export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Backend server is not responding. Please check if it\'s running.');
  }
}
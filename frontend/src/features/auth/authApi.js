import apiClient from "../../services/apiClient";

const authApi = {
  register : (data) => apiClient.post("http://localhost:3000/api/user/user-registration", data)
}

export default authApi
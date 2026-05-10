package proxy

import (
	"io"
	"net/http"
	"os"
)

// Forward faz proxy de uma requisição para a Tide API com o token JWT.
func Forward(w http.ResponseWriter, r *http.Request, path, query, token string) {
	baseURL := os.Getenv("TIDE_API_BASE_URL")

	url := baseURL + path
	if query != "" {
		url += "?" + query
	}

	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, url, nil)
	if err != nil {
		http.Error(w, "erro ao criar requisição", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, "erro ao contatar a API", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

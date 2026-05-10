package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

type tokenCache struct {
	mu        sync.Mutex
	token     string
	expiresAt time.Time
}

var cache = &tokenCache{}

type tokenRequest struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

type tokenResponse struct {
	AccessToken string `json:"access_token"`
}

// GetToken retorna um token válido, renovando se necessário.
// O secret nunca sai deste processo — nunca é exposto ao browser.
func GetToken() (string, error) {
	cache.mu.Lock()
	defer cache.mu.Unlock()

	// Token ainda válido (com margem de 60s)
	if cache.token != "" && time.Now().Before(cache.expiresAt) {
		return cache.token, nil
	}

	baseURL := os.Getenv("TIDE_API_BASE_URL")
	clientID := os.Getenv("TIDE_CLIENT_ID")
	secret := os.Getenv("TIDE_CLIENT_SECRET")

	if baseURL == "" || clientID == "" || secret == "" {
		return "", fmt.Errorf("variáveis TIDE_API_BASE_URL, TIDE_CLIENT_ID ou TIDE_CLIENT_SECRET não definidas")
	}

	body, _ := json.Marshal(tokenRequest{ClientID: clientID, ClientSecret: secret})

	resp, err := http.Post(baseURL+"/api/auth/token", "application/json", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("erro ao chamar /api/auth/token: %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("auth retornou status %d", resp.StatusCode)
	}

	var result tokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("erro ao decodificar token: %w", err)
	}

	// Cache por 55 minutos (tokens JWT tipicamente expiram em 1h)
	cache.token = result.AccessToken
	cache.expiresAt = time.Now().Add(55 * time.Minute)

	return cache.token, nil
}

package handlers

import (
	"net/http"

	"github.com/casimiroarruda/react-tide-app/bff/auth"
	"github.com/casimiroarruda/react-tide-app/bff/proxy"
)

// Tides faz proxy de GET /tides/{locationId}/{day}
// para GET /api/location/{locationId}/tides/{day} na Tide API.
func Tides(w http.ResponseWriter, r *http.Request) {
	locationId := r.PathValue("locationId")
	day := r.PathValue("day")

	token, err := auth.GetToken()
	if err != nil {
		http.Error(w, "falha ao obter token", http.StatusBadGateway)
		return
	}

	apiPath := "/api/location/" + locationId + "/tides/" + day
	proxy.Forward(w, r, apiPath, "", token)
}

package handlers

import (
	"net/http"

	"github.com/casimiroarruda/react-tide-app/bff/auth"
	"github.com/casimiroarruda/react-tide-app/bff/proxy"
)

// Locations faz proxy de GET /locations?lat=&lon= ou ?name=
// para GET /api/location na Tide API.
func Locations(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GetToken()
	if err != nil {
		http.Error(w, "falha ao obter token", http.StatusBadGateway)
		return
	}

	// Repassa os query params intactos (?lat=&lon= ou ?name=)
	proxy.Forward(w, r, "/api/location", r.URL.RawQuery, token)
}

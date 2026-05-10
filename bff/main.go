package main

import (
	"log"
	"net/http"
	"os"

	"github.com/casimiroarruda/react-tide-app/bff/handlers"
	"github.com/casimiroarruda/react-tide-app/bff/middleware"
)

func main() {
	port := os.Getenv("BFF_PORT")
	if port == "" {
		port = "3001"
	}

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Rotas do proxy
	mux.HandleFunc("/locations", handlers.Locations)
	mux.HandleFunc("/tides/{locationId}/{day}", handlers.Tides)

	// Aplica CORS em todas as rotas
	corsOrigin := os.Getenv("FRONTEND_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}

	handler := middleware.CORS(corsOrigin)(mux)

	log.Printf("BFF escutando em :%s (CORS: %s)", port, corsOrigin)

	log.Fatal(http.ListenAndServe(":"+port, handler))
}

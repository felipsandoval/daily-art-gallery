"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Calendar, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Actualizar la estructura de datos de artworks para incluir diferentes tipos de imágenes
const artworks = [
  {
    id: 1,
    title: "La noche estrellada",
    artist: "Vincent van Gogh",
    year: "1889",
    quote: "Sueño con pintar y luego pinto mi sueño.",
    description:
      "Una de las obras más reconocidas del arte occidental, pintada durante su estancia en el sanatorio de Saint-Rémy-de-Provence.",
    // Imagen real (puede fallar por derechos de autor)
    realImage: null, // No disponible
    // Descripción detallada para generar con IA
    aiImageQuery:
      "Post-impressionist painting of swirling night sky with bright stars over a village, cypress tree in foreground, thick brushstrokes, blue and yellow palette, Van Gogh style",
    // Fallback abstracto
    abstractQuery: "Swirling blue and yellow abstract pattern representing night sky and stars",
    link: "https://es.wikipedia.org/wiki/La_noche_estrellada",
    dayOfYear: new Date().getDate(),
  },
  {
    id: 2,
    title: "La persistencia de la memoria",
    artist: "Salvador Dalí",
    year: "1931",
    quote: "No tengo por qué ser modesto; no soy modesto.",
    description: "Los famosos relojes blandos que desafían nuestra percepción del tiempo y la realidad.",
    realImage: null,
    aiImageQuery:
      "Surrealist painting of melting clocks draped over tree branches and geometric shapes in a desert landscape, hyperrealistic style, warm golden light",
    abstractQuery: "Abstract representation of flowing time with curved shapes and warm desert colors",
    link: "https://es.wikipedia.org/wiki/La_persistencia_de_la_memoria",
    dayOfYear: new Date().getDate() + 1,
  },
  {
    id: 3,
    title: "La Gran Ola de Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    quote: "A los 73 años he aprendido un poco sobre la verdadera estructura de la naturaleza.",
    description: "Icónica obra del arte japonés que representa la fuerza y belleza del océano.",
    realImage: null,
    aiImageQuery:
      "Japanese woodblock print style giant wave with white foam claws reaching toward Mount Fuji, traditional ukiyo-e art style, blue and white colors",
    abstractQuery: "Abstract flowing wave pattern in traditional Japanese blue and white colors",
    link: "https://es.wikipedia.org/wiki/La_gran_ola_de_Kanagawa",
    dayOfYear: new Date().getDate() + 2,
  },
  {
    id: 4,
    title: "El Grito",
    artist: "Edvard Munch",
    year: "1893",
    quote: "El arte surge de la alegría y el dolor... pero sobre todo del dolor.",
    description: "Expresión visual de la angustia existencial moderna, una de las obras más reconocibles del arte.",
    realImage: null,
    aiImageQuery:
      "Expressionist painting of a figure with hands on face screaming on a bridge, swirling orange and red sky, distorted perspective, emotional brushwork",
    abstractQuery: "Abstract swirling orange and red composition suggesting emotional turmoil",
    link: "https://es.wikipedia.org/wiki/El_grito",
    dayOfYear: new Date().getDate() + 3,
  },
]

// Agregar el componente ArtworkImage después de los imports
interface ArtworkImageProps {
  artwork: (typeof artworks)[0]
  className?: string
}

function ArtworkImage({ artwork, className }: ArtworkImageProps) {
  const [imageState, setImageState] = useState<"loading" | "ai" | "abstract" | "error">("loading")
  const [currentImageUrl, setCurrentImageUrl] = useState("")

  useEffect(() => {
    // Intentar cargar imagen real primero (si existe)
    if (artwork.realImage) {
      const img = new Image()
      img.onload = () => {
        setCurrentImageUrl(artwork.realImage!)
        setImageState("ai")
      }
      img.onerror = () => {
        // Si falla, usar imagen generada por IA
        loadAIImage()
      }
      img.src = artwork.realImage
    } else {
      // Directamente usar imagen generada por IA
      loadAIImage()
    }
  }, [artwork])

  const loadAIImage = () => {
    const aiImageUrl = `/placeholder.png?height=600&width=800&query=${encodeURIComponent(artwork.aiImageQuery)}`
    const img = new Image()
    img.onload = () => {
      setCurrentImageUrl(aiImageUrl)
      setImageState("ai")
    }
    img.onerror = () => {
      // Como último recurso, usar imagen abstracta
      loadAbstractImage()
    }
    img.src = aiImageUrl
  }

  const loadAbstractImage = () => {
    const abstractImageUrl = `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(artwork.abstractQuery)}`
    setCurrentImageUrl(abstractImageUrl)
    setImageState("abstract")
  }

  const handleImageError = () => {
    if (imageState === "ai") {
      loadAbstractImage()
    } else if (imageState === "abstract") {
      setImageState("error")
    }
  }

  if (imageState === "error") {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <Palette className="w-16 h-16 text-slate-400 mx-auto" />
          <div>
            <p className="text-slate-600 font-medium">{artwork.title}</p>
            <p className="text-slate-500 text-sm">
              {artwork.artist}, {artwork.year}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageState === "loading" && (
        <div className={`${className} bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center`}>
          <div className="animate-pulse space-y-2 text-center">
            <Palette className="w-8 h-8 text-slate-400 mx-auto animate-spin" />
            <p className="text-slate-500 text-sm">Preparando la obra...</p>
          </div>
        </div>
      )}

      {currentImageUrl && (
        <img
          src={currentImageUrl || "/placeholder.svg"}
          alt={`${artwork.title} por ${artwork.artist}`}
          className={`${className} transition-opacity duration-500 ${imageState === "loading" ? "opacity-0" : "opacity-100"}`}
          onError={handleImageError}
        />
      )}

      {/* Indicador del tipo de imagen */}
      {imageState !== "loading" && (
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs text-white/80">
            {imageState === "ai" ? "🎨 IA" : imageState === "abstract" ? "🎭 Abstracto" : "📸 Original"}
          </span>
        </div>
      )}
    </div>
  )
}

export default function DailyArtGallery() {
  const [currentArtwork, setCurrentArtwork] = useState(artworks[0])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Simular carga de la obra del día
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )
    const artworkIndex = dayOfYear % artworks.length

    setCurrentArtwork(artworks[artworkIndex])
    setCurrentDate(
      today.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Animación de entrada
    setTimeout(() => setIsLoaded(true), 500)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl" />

      {/* Header minimalista */}
      <header className="relative z-10 p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-slate-600" />
          <h1 className="text-2xl font-light text-slate-800 tracking-wide">Galería Diaria</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <time className="capitalize">{currentDate}</time>
        </div>
      </header>

      {/* Caballete y lienzo principal */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-8">
        <div
          className={`transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Simulación del caballete */}
          <div className="relative">
            {/* Patas del caballete (decorativas) */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-amber-800/60 to-amber-900/80 rounded-full" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 -translate-x-12 w-1 h-12 bg-gradient-to-b from-amber-800/40 to-amber-900/60 rounded-full rotate-12" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 translate-x-12 w-1 h-12 bg-gradient-to-b from-amber-800/40 to-amber-900/60 rounded-full -rotate-12" />

            {/* Marco del lienzo */}
            <Card className="relative p-8 bg-white/80 backdrop-blur-sm border-2 border-amber-100/50 shadow-2xl shadow-black/10 max-w-4xl">
              <div className="absolute inset-2 border border-amber-200/30 rounded-sm" />

              {/* Contenido del lienzo */}
              <div className="space-y-8">
                {/* Imagen de la obra */}
                <div className="relative group">
                  <div className="aspect-[4/3] w-full max-w-2xl mx-auto overflow-hidden rounded-sm shadow-lg">
                    <ArtworkImage
                      artwork={currentArtwork}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Placa informativa */}
                  <div className="absolute -bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded shadow-lg border border-slate-200/50">
                    <p className="text-sm font-medium text-slate-800">{currentArtwork.title}</p>
                    <p className="text-xs text-slate-600">
                      {currentArtwork.artist}, {currentArtwork.year}
                    </p>
                  </div>
                </div>

                {/* Cita del artista */}
                <blockquote className="text-center space-y-4">
                  <p className="text-xl md:text-2xl font-serif italic text-slate-700 leading-relaxed max-w-2xl mx-auto">
                    "{currentArtwork.quote}"
                  </p>
                  <cite className="block text-sm font-sans text-slate-500 not-italic">— {currentArtwork.artist}</cite>
                </blockquote>

                {/* Descripción */}
                <p className="text-center text-slate-600 max-w-xl mx-auto leading-relaxed">
                  {currentArtwork.description}
                </p>

                {/* Botón para más información */}
                <div className="flex justify-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group text-slate-600 hover:text-slate-800 hover:bg-slate-100/50 transition-all duration-300"
                    onClick={() => window.open(currentArtwork.link, "_blank")}
                  >
                    <span className="mr-2">Explorar más</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="relative z-10 text-center p-8">
        <p className="text-xs text-slate-400">Una nueva obra maestra cada día • Galería Virtual</p>
      </footer>
    </div>
  )
}

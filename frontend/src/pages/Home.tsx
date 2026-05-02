import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMovies } from '../api/movies'
import type { Movie } from '../types'

const RATING_LABEL: Record<Movie['rating'], string> = {
  ALL: '전체',
  AGE_12: '12세',
  AGE_15: '15세',
  AGE_19: '청불',
}

const RATING_STYLE: Record<Movie['rating'], string> = {
  ALL: 'bg-white/90 text-gray-600 border border-gray-300',
  AGE_12: 'bg-sky-500 text-white',
  AGE_15: 'bg-orange-500 text-white',
  AGE_19: 'text-white',
}

const BURGUNDY = '#8B1A2B'

function MovieCard({ movie }: { movie: Movie }) {
  const age19Style = movie.rating === 'AGE_19' ? { backgroundColor: BURGUNDY } : {}

  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div
        className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 relative bg-sky-100 shadow-sm group-hover:shadow-xl transition-all duration-300"
        style={{ border: '1.5px solid #bae6fd', outline: '0px solid transparent' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = BURGUNDY)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#bae6fd')}
      >
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-sky-300 gap-2">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-medium">포스터 없음</span>
          </div>
        )}

        {/* Rating badge */}
        <span
          className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm ${RATING_STYLE[movie.rating]}`}
          style={age19Style}
        >
          {RATING_LABEL[movie.rating]}
        </span>

        {/* Rating overlay at bottom */}
        {movie.avg_rating && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 py-3">
            <span className="text-yellow-400 text-sm leading-none">★</span>
            <span className="text-white text-xs ml-1 font-semibold">{Number(movie.avg_rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-orange-500 transition-colors leading-snug">
        {movie.title}
      </p>
      <p className="text-gray-400 text-xs mt-0.5">{movie.runtime}분</p>
    </Link>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMovies('NOW_SHOWING')
      .then((res) => setMovies(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <div
        className="py-10 px-4"
        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-100 text-xs font-semibold uppercase tracking-widest mb-2">Now Playing</p>
          <h1 className="text-3xl font-black text-white mb-1.5 leading-tight">
            지금 바로 예매하세요
          </h1>
          <p className="text-sky-100 text-sm mb-6">최신 영화를 가장 빠르게, 원하는 좌석으로</p>
          <div className="flex gap-2.5">
            <button
              onClick={() => {}}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg"
              style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.45)' }}
            >
              영화별 예매
            </button>
            <button
              onClick={() => navigate('/theaters')}
              className="bg-white/20 hover:bg-white/35 text-white border border-white/50 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm"
            >
              극장별 예매
            </button>
          </div>
        </div>
      </div>

      {/* Movie Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-1 h-7 rounded-full" style={{ backgroundColor: BURGUNDY }} />
          <h2 className="text-xl font-black text-gray-900">현재 상영 중</h2>
          {!loading && (
            <span
              className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#8B1A2B15', color: BURGUNDY }}
            >
              {movies.length}편
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-sky-100 rounded-2xl mb-3" />
                <div className="h-4 bg-sky-100 rounded-lg w-3/4 mb-1.5" />
                <div className="h-3 bg-sky-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-sm">상영 중인 영화가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8" style={{ backgroundColor: '#0c4a6e' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-0.5 mb-2">
                <span className="text-lg font-black text-white tracking-tight">CINE</span>
                <span className="text-lg font-black text-orange-400 tracking-tight">BOOK</span>
              </div>
              <p className="text-sky-300 text-xs">영화 예매 서비스 · 최신 영화 · 편리한 예매</p>
            </div>
            <p className="text-sky-400 text-xs">© 2026 CineBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

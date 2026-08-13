import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getMyWishlist, removeWishlist } from '../api/properties'
import type { Wishlist } from '../types'

export default function MyWishlist() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getMyWishlist()
      .then(r => setWishlists(r.data))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const handleRemove = async (propertyId: string) => {
    await removeWishlist(propertyId)
    setWishlists(prev => prev.filter(f => f.property_id !== propertyId))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">위시리스트한 숙소</h1>
      {wishlists.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">위시리스트한 숙소가 없습니다</p>
          <Link to="/" className="text-blue-600 hover:underline">숙소 보러 가기</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlists.map(fav => (
            <div key={fav.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <Link to={`/properties/${fav.property_id}`}>
                <div className="aspect-[2/3] bg-gray-200 overflow-hidden">
                  {fav.property_photo_url ? (
                    <img
                      src={fav.property_photo_url}
                      alt={fav.property_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                      🎬
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm truncate">{fav.property_name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(fav.created_at).toLocaleDateString('ko-KR')} 추가
                  </p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => handleRemove(fav.property_id)}
                  className="w-full py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  위시리스트 해제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BiSolidOffer } from 'react-icons/bi'
import { Calendar, Clock } from 'lucide-react';
import { getAllOffersServerSide } from '@/server/functions/admin.fun';
import { toast } from 'sonner';
import { IOffer } from '@/server/models/offer/offer.interface';

function PromoAndDelivery() {
  const [loading, setLoading] = useState<boolean>(false);
  const [offers, setOffers] = useState<IOffer[]>([]);

  useEffect(() => {
    fetchOffers()
  }, []);

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const response = await getAllOffersServerSide()
      if (!response.isError && response.data) {
        setOffers(response.data.offers || [])
      } else {
        toast.error(response.message || 'Failed to fetch offers')
      }
    } catch (error) {
      toast.error('Failed to fetch offers')
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const activeOffers = offers.filter(offer => {
    const now = new Date();
    return offer.isActive && new Date(offer.endDate) >= now;
  });

  const isExpiringSoon = (endDate: Date) => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return new Date(endDate) <= threeDaysFromNow;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Dynamic grid class based on number of offers
  const getGridClass = () => {
    const count = activeOffers.length;
    
    if (count === 1) {
      return "flex justify-center"; // Single offer - center it
    } else if (count === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"; // 2 offers side by side
    } else if (count === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"; // 3 offers in triangle
    } else {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"; // 4+ offers in grid
    }
  };

  // Dynamic card width based on number of offers
  const getCardWidth = () => {
    const count = activeOffers.length;
    
    if (count === 1) {
      return "w-full max-w-md"; // Single offer - medium width
    } else if (count === 2) {
      return "w-full"; // 2 offers - full width of grid column
    } else {
      return "w-full"; // 3+ offers - full width of grid column
    }
  };

  return (
    <section className='bg-white pb-20 px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12'>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl w-full"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F27D31] leading-tight">
          Promo & Delivery <span className="text-black">Process</span>
        </h2>
        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          Discover amazing offers and promotions. Limited time deals to enhance your shopping experience.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F27D31]"></div>
        </div>
      ) : activeOffers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 w-full"
        >
          <BiSolidOffer className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 mb-2">No Active Offers</h3>
          <p className="text-gray-400 text-sm sm:text-base">Check back later for amazing deals!</p>
        </motion.div>
      ) : (
        <motion.div
          className={getGridClass()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer._id as string}
              className={`min-h-[280px] rounded-xl text-white shadow-lg shadow-black/20 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group ${getCardWidth()}`}
              whileHover={{ 
                scale: activeOffers.length <= 3 ? 1.05 : 1.02, // Bigger scale for fewer cards
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 100,
                damping: 15
              }}
              style={{
                background: isExpiringSoon(offer.endDate) 
                  ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
                  : 'linear-gradient(135deg, #F27D31 0%, #FFA726 100%)'
              }}
            >
              {/* Header with Icon and Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl sm:text-4xl opacity-90">
                  <BiSolidOffer />
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isExpiringSoon(offer.endDate) && (
                    <motion.p 
                      className="text-xs font-bold bg-red-600/80 px-2 py-1 rounded-md"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Ending Soon!
                    </motion.p>
                  )}
                  <p className="text-sm font-semibold bg-white/20 px-2 sm:px-3 py-1 rounded-md whitespace-nowrap">
                    {offer.discount}% OFF
                  </p>
                </div>
              </div>

              {/* Offer Content */}
              <div className="flex-1 flex flex-col justify-center space-y-3 mb-4">
                <h3 className={`font-bold leading-tight line-clamp-2 min-h-[3rem] flex items-center justify-center text-center ${
                  activeOffers.length === 1 ? 'text-2xl sm:text-3xl' : 
                  activeOffers.length === 2 ? 'text-xl sm:text-2xl' : 
                  'text-lg sm:text-xl'
                }`}>
                  {offer.title}
                </h3>
                
                <p className="text-xs sm:text-sm opacity-90 line-clamp-3 min-h-[3.5rem] flex items-center text-center">
                  {offer.shortNote}
                </p>
                
                <div className="mt-2 sm:mt-3">
                  <p className="text-xs sm:text-sm mb-1 sm:mb-2 text-center">Use Promo Code:</p>
                  <div className="bg-white/25 rounded-lg py-2 px-3 sm:px-4 inline-block max-w-full mx-auto flex justify-center">
                    <span className="font-mono text-base sm:text-lg font-bold tracking-wider break-all">
                      {offer.promoCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer with Date Info */}
              <div className="flex justify-between items-center pt-3 border-t border-white/30 text-xs sm:text-sm">
                <div className="flex items-center gap-1 opacity-80 flex-1 min-w-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Until {formatDate(offer.endDate)}</span>
                </div>
                {isExpiringSoon(offer.endDate) && (
                  <div className="flex items-center gap-1 opacity-80 flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Hurry!</span>
                  </div>
                )}
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 -inset-x-32 -inset-y-32 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Free Delivery Banner */}
      {activeOffers.length > 0 && (
        <motion.div
          className="w-full max-w-4xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-full min-h-[160px] sm:min-h-[180px] rounded-xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Free Delivery</h3>
              <p className="text-sm sm:text-base">
                Enjoy <span className="text-[#F27D31] font-semibold">free delivery</span> on all orders above 1000TK
              </p>
              <p className="text-xs opacity-80 mt-2">
                *Available for all customers
              </p>
            </div>
            <div className="text-4xl sm:text-5xl text-[#F27D31] opacity-80 flex-shrink-0">
              🚚
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default PromoAndDelivery
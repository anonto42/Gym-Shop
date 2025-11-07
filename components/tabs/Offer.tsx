"use client";
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { IOffer } from '@/server/models/offer/offer.interface'
import Loader from '../loader/Loader'
import { Switch } from '../ui/switch'
import { createOfferServerSide, deleteOfferServerSide, getAllOffersServerSide, toggleOfferStatusServerSide, updateOfferServerSide } from '@/server/functions/admin.fun';

function Offer() {
  const [offers, setOffers] = useState<IOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<IOffer | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    shortNote: '',
    promoCode: '',
    discount: 0,
    startDate: '',
    endDate: '',
    isActive: true
  })

  useEffect(() => {
    fetchOffers()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? Number(value) : value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      shortNote: '',
      promoCode: '',
      discount: 0,
      startDate: '',
      endDate: '',
      isActive: true
    })
    setEditingOffer(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.shortNote || !formData.promoCode || !formData.discount || !formData.startDate || !formData.endDate) {
      toast.error('All fields are required')
      return
    }

    if (formData.discount < 1 || formData.discount > 100) {
      toast.error('Discount must be between 1% and 100%')
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date')
      return
    }

    setLoading(true)
    try {
      let response
      
      if (editingOffer) {
        response = await updateOfferServerSide(editingOffer._id as string, {
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        })
      } else {
        response = await createOfferServerSide({
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        })
      }

      if (response.isError) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        resetForm()
        fetchOffers()
      }
    } catch (error) {
      toast.error('Failed to save offer')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (offer: IOffer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      shortNote: offer.shortNote,
      promoCode: offer.promoCode,
      discount: offer.discount,
      startDate: offer.startDate.toISOString().split('T')[0],
      endDate: offer.endDate.toISOString().split('T')[0],
      isActive: offer.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    setLoading(true)
    try {
      const response = await deleteOfferServerSide(offerId)
      if (response.isError) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        fetchOffers()
      }
    } catch (error) {
      toast.error('Failed to delete offer')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (offerId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const response = await toggleOfferStatusServerSide(offerId)
      if (response.isError) {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        fetchOffers()
      }
    } catch (error) {
      toast.error('Failed to update offer status')
    } finally {
      setLoading(false)
    }
  }

  const isOfferActive = (offer: IOffer) => {
    const now = new Date()
    return offer.isActive && offer.startDate <= now && offer.endDate >= now
  }

  const isOfferExpired = (offer: IOffer) => {
    const now = new Date()
    return offer.endDate < now
  }

  return (
    <div className='w-full min-h-[88vh] p-4 overflow-hidden'>
      {loading && <Loader />}
      
      <div className='w-full h-full bg-white border rounded-3xl p-6'>
        {/* Header */}
        <div className='w-full flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold'>Offer Management</h1>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className='bg-[#125BAC] cursor-pointer hover:bg-[#0f4a8c]'
          >
            {showForm ? 'Cancel' : 'Add Offer'}
          </Button>
        </div>

        {/* Offer Form */}
        {showForm && (
          <div className='mb-6 p-6 border rounded-2xl bg-gray-50'>
            <h2 className='text-xl font-semibold mb-4'>
              {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            
            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>Title *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Offer title"
                  className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500'
                />
              </div>

              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>Promo Code *</Label>
                <Input
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="SUMMER25"
                  className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 uppercase'
                />
              </div>

              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>Discount (%) *</Label>
                <Input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="25"
                  min="1"
                  max="100"
                  className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500'
                />
              </div>

              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>Status</Label>
                <div className='flex items-center space-x-2 p-3'>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label>{formData.isActive ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>

              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>Start Date *</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500'
                />
              </div>

              <div className='flex flex-col'>
                <Label className='text-sm font-medium mb-2'>End Date *</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500'
                />
              </div>

              <div className='flex flex-col md:col-span-2'>
                <Label className='text-sm font-medium mb-2'>Short Description *</Label>
                <Textarea
                  name="shortNote"
                  value={formData.shortNote}
                  onChange={handleInputChange}
                  placeholder="Brief description of the offer"
                  className='min-h-[80px] p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 resize-vertical'
                />
              </div>

              <div className='flex gap-3 md:col-span-2'>
                <Button 
                  type="submit"
                  className='bg-green-600 hover:bg-green-700 cursor-pointer px-6 py-2'
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
                </Button>
                <Button 
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className='border-gray-300 hover:bg-gray-50'
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Offers Grid */}
        <div className='w-full'>
          {offers.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No offers found</p>
              <p className='text-gray-400'>Create your first offer to get started</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {offers.map((offer) => (
                <div 
                  key={offer._id as string}
                  className={`border rounded-2xl p-4 relative transition-all duration-300 hover:shadow-lg ${
                    isOfferExpired(offer) ? 'bg-red-50 border-red-200' : 
                    isOfferActive(offer) ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  {/* Status Badge */}
                  <div className='absolute top-3 right-3'>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isOfferExpired(offer) ? 'bg-red-100 text-red-800' :
                      isOfferActive(offer) ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {isOfferExpired(offer) ? 'Expired' : 
                       isOfferActive(offer) ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Offer Content */}
                  <h3 className='text-xl font-semibold mb-2 pr-16'>{offer.title}</h3>
                  <p className='text-gray-600 text-sm mb-3'>{offer.shortNote}</p>
                  
                  <div className='space-y-2 mb-4'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-500'>Promo Code:</span>
                      <span className='font-mono bg-yellow-100 px-2 py-1 rounded text-sm'>
                        {offer.promoCode}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-500'>Discount:</span>
                      <span className='font-semibold text-green-600'>{offer.discount}%</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-500'>Valid Until:</span>
                      <span className='text-sm'>{offer.endDate.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex justify-between items-center pt-3 border-t'>
                    <Button 
                      onClick={() => handleToggleStatus(offer._id as string, offer.isActive)}
                      variant="outline"
                      size="sm"
                      className={`cursor-pointer ${
                        offer.isActive ? 'border-orange-300 text-orange-600' : 'border-green-300 text-green-600'
                      }`}
                    >
                      {offer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <div className='flex gap-2'>
                      <Button 
                        onClick={() => handleEdit(offer)}
                        className='cursor-pointer bg-[#125BAC] text-white p-2 rounded-lg'
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(offer._id as string)}
                        className='cursor-pointer bg-[#ac1212] text-white p-2 rounded-lg'
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Offer
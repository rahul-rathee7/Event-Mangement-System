'use client'

import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Calendar, MapPin, DollarSign, Tag, Users, Info, ChevronRight, ChevronLeft, CheckCircle2, ImageIcon, X, Plus } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast, Toaster } from 'sonner'
import { useEventContext } from '@/context/EventContext'

const CategorySelector = lazy(() => import('@/components/admin/CategorySelector'))
const TicketOptionsEditor = lazy(() => import('@/components/admin/TicketOptionsEditor'))
const LocationPicker = lazy(() => import('@/components/admin/LocationPicker'))

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDescription: z.string().max(200, 'Short description must be under 200 characters'),
  startDate: z.date().refine(date => date > new Date(), 'Event must start in the future'),
  endDate: z.date().optional(),
  location: z.string().min(3, 'Please provide a location'),
  isOnline: z.boolean().default(false),
  category: z.string().min(1, 'Please select a category'),
  capacity: z.number().int().positive().optional(),
  ticketPrice: z.number().min(0, 'Price cannot be negative'),
  isFree: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  organizerInfo: z.string().optional(),
  // FIX: Added ticketOptions to the schema so its data can be saved and validated.
  ticketOptions: z.array(z.any()).optional(),
})
// FIX: Added a schema-level refinement check.
// This ensures that if an end date is provided, it *must* be after the start date.
.refine(data => {
  if (data.endDate) {
    return data.endDate > data.startDate;
  }
  return true; // No end date, so validation passes
}, {
  message: 'End date must be after the start date',
  path: ['endDate'], // Tells react-hook-form to show this error under the endDate field
});

const StepIndicator = ({ currentStep, steps, goToStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.button
              onClick={() => goToStep(index)}
              className={`flex flex-col items-center justify-center ${
                currentStep >= index ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
              whileHover={currentStep >= index ? { scale: 1.05 } : {}}
              whileTap={currentStep >= index ? { scale: 0.95 } : {}}
              disabled={currentStep < index}
            >
              <div 
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep > index 
                    ? "bg-green-500 text-white" 
                    : currentStep === index 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {currentStep > index ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium hidden sm:block">{step}</span>
            </motion.button>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 rounded ${
                  currentStep > index 
                    ? "bg-green-500" 
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const FormField = ({ label, error, children }) => (
  <motion.div 
    className="mb-5"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
    )}
  </motion.div>
)

const TagInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('')
  
  const addTag = useCallback(() => {
    if (inputValue.trim() !== '' && !value.includes(inputValue.trim())) {
      const newTags = [...value, inputValue.trim()]
      onChange(newTags)
      setInputValue('')
    }
  }, [inputValue, value, onChange])
  
  const removeTag = useCallback((tagToRemove) => {
    const newTags = value.filter(tag => tag !== tagToRemove)
    onChange(newTags)
  }, [value, onChange])
  
  return (
    <div>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
          placeholder="Add tag and press Enter"
        />
        <button
          type="button"
          onClick={addTag}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const ImageDropzone = ({ onChange, value }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          onChange({
            file,
            preview: e.target.result
          })
        }
        reader.readAsDataURL(file)
      }
    }
  })
  
  return (
    <div className="mt-1">
      {value?.preview ? (
        <div className="relative w-full h-48 mb-3 border rounded-lg overflow-hidden">
          <Image
            src={value.preview}
            alt="Event cover"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-700'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-10 h-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Max file size: 5MB (JPG, PNG, GIF)
          </p>
        </div>
      )}
    </div>
  )
}

// Main component
const CreateEventPage = () => {
  // Form state and handlers
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const { sendData } = useEventContext();
  // FIX: useTheme was imported but not used.
  // const { theme } = useTheme()
  
  const { 
    control, 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    // FIX: Get `trigger` and `reset` from useForm.
    // `trigger` lets us manually run validation.
    // `reset` lets us clear the form after success.
    trigger,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: zodResolver(eventSchema),
    mode: 'onChange', // This mode runs validation on every change
    defaultValues: {
      name: '',
      description: '',
      shortDescription: '',
      startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      location: '',
      isOnline: false,
      category: '',
      capacity: undefined,
      ticketPrice: 0,
      isFree: true,
      isPublic: true,
      tags: [],
      organizerInfo: '',
      // FIX: Added ticketOptions to defaultValues to match the schema.
      ticketOptions: [],
    }
  })
  
  const isFree = watch('isFree')
  const isOnline = watch('isOnline')
  
  // Steps for the form wizard
  const steps = ['Basic Info', 'Details', 'Tickets & Capacity', 'Preview']
  
  // FIX: This array maps step numbers to the field names in that step.
  // This is crucial for our new validation logic.
  const stepFields = [
    ['name', 'shortDescription', 'description'], // Step 0 fields
    ['startDate', 'endDate', 'location', 'category'], // Step 1 fields
    ['ticketPrice', 'capacity'], // Step 2 fields
    [] // Step 3 (Preview) has no fields to validate
  ];
  
  // FIX: This function was flawed. It only *checked* for existing errors,
  // it didn't *run* validation. This logic is now inside `nextStep`.
  // const isStepValid = useCallback((step) => { ... })
  
  // Step navigation handlers
  
  // FIX: Rewrote `nextStep` to be `async` and use `trigger()`.
  // This is the *correct* way to do multi-step validation.
  const nextStep = useCallback(async () => {
    // 1. Get the field names for the *current* step.
    const fieldsToValidate = stepFields[currentStep];
    
    // 2. Manually trigger validation for only those fields.
    const isValid = await trigger(fieldsToValidate);

    // 3. If validation passes, move to the next step.
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!isValid) {
      // 4. If validation fails, show an error toast.
      toast.error('Please fix the errors before proceeding.');
    }
    
    // Original broken logic:
    // if(!watch('name') || !watch('shortDescription')) return toast.error("Please fill all required fields in Basic Info."); 
    // if (currentStep < steps.length - 1 && isStepValid(currentStep)) { ... }
    
  }, [currentStep, steps.length, trigger])
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])
  
  // FIX: Simplified `goToStep`.
  // We only need to check if the step being clicked is *behind* or *at* the current step.
  // The UI's `disabled` prop already prevents jumping ahead.
  const goToStep = useCallback((step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep])
  
  const onSubmit = useCallback(async (data) => {
    try {
      setIsSubmitting(true)
      // Add the cover image file and ticket options to the data
      const eventData = {
        ...data,
        coverImage: coverImage?.file || null,
        // FIX: `data.ticketOptions` now contains the data from the editor.
        ticketOptions: data.ticketOptions, 
      }
      
      console.log('Form submitted with data:', eventData)

      await sendData(eventData);
      
      setIsSuccess(true)
      toast.success('Event created successfully!')
      reset();
      setCoverImage(null);
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false)
    }
  }, [coverImage, reset]) // FIX: Added `reset` to dependency array
  
  // Cleanup function for image previews
  useEffect(() => {
    return () => {
      if (coverImage?.preview) {
        URL.revokeObjectURL(coverImage.preview)
      }
    }
  }, [coverImage])
  
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Created Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your event has been created and is pending approval.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => window.location.href = '/admin/events'} // This is fine, or use Next.js router
            >
              View All Events
            </button>
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-3 sm:mt-0"
              onClick={() => {
                // FIX: This button must also reset the form and image state.
                reset();
                setCoverImage(null);
                setIsSuccess(false);
                setCurrentStep(0);
              }}
            >
              Create Another Event
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Fill in the details to create a new event</p>
      </motion.div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <StepIndicator 
          currentStep={currentStep} 
          steps={steps}
          goToStep={goToStep}
        />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Info className="mr-2" size={18} />
                  Basic Information
                </h2>
                
                <FormField label="Event Name" error={errors.name?.message}>
                  <input
                    type="text"
                    {...register('name')}
                    className="block w-full text-xl py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                    placeholder="e.g., Annual Tech Conference 2025"
                  />
                </FormField>
                
                <FormField label="Short Description" error={errors.shortDescription?.message}>
                  <input
                    type="text"
                    {...register('shortDescription')}
                    className="block w-full text-xl py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                    placeholder="Brief tagline or short description"
                  />
                </FormField>
                
                <FormField label="Full Description" error={errors.description?.message}>
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="block w-full text-xl py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                    placeholder="Provide a detailed description of your event..."
                  />
                </FormField>
                
                <FormField label="Cover Image">
                  <ImageDropzone 
                    onChange={setCoverImage} 
                    value={coverImage}
                  />
                </FormField>
              </motion.div>
            )}
            
            {/* Step 2: Event Details */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="mr-2" size={18} />
                  Event Details
                </h2>
                
                <FormField label="Start Date & Time" error={errors.startDate?.message}>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="block w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                        wrapperClassName="block w-full"
                        calendarClassName="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        // FIX: Add minDate to prevent selecting past dates
                        minDate={new Date()}
                      />
                    )}
                  />
                </FormField>
                
                <FormField label="End Date & Time (Optional)" error={errors.endDate?.message}>
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="block w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                        wrapperClassName="block w-full"
                        calendarClassName="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        placeholderText="Optional"
                        // FIX: End date cannot be before the start date
                        minDate={watch('startDate') || new Date()}
                      />
                    )}
                  />
                </FormField>
                
                <FormField label="Event Type">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="false"
                        checked={!isOnline}
                        onChange={() => setValue('isOnline', false, { shouldValidate: true })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In-person</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="true"
                        checked={isOnline}
                        onChange={() => setValue('isOnline', true, { shouldValidate: true })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Virtual</span>
                    </label>
                  </div>
                </FormField>
                
                <FormField label={isOnline ? "Meeting Link" : "Location"} error={errors.location?.message}>
                  {isOnline ? (
                    <input
                      type="text"
                      {...register('location')}
                      className="block w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                      placeholder="e.g., https://zoom.us/j/123456789"
                    />
                  ) : (
                    <Suspense fallback={<div className="w-full h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>}>
                      <LocationPicker
                        value={watch('location')}
                        onChange={(value) => setValue('location', value, { shouldValidate: true })}
                      />
                    </Suspense>
                  )}
                </FormField>
                
                <FormField label="Category" error={errors.category?.message}>
                  <Suspense fallback={<div className="py-2 pl-3 h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>}>
                    <CategorySelector
                      value={watch('category')}
                      onChange={(value) => setValue('category', value, { shouldValidate: true })}
                    />
                  </Suspense>
                </FormField>
                
                <FormField label="Tags">
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormField>
              </motion.div>
            )}
            
            {/* Step 3: Tickets & Capacity */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign className="mr-2" size={18} />
                  Tickets & Capacity
                </h2>
                
                <FormField label="Is this a free event?">
                  <div className="flex items-center h-5">
                    <input
                      id="isFree"
                      type="checkbox"
                      // FIX: Removed `...register('isFree')`
                      // Using `checked` and `onChange` with `setValue` is clearer.
                      checked={isFree}
                      onChange={(e) => setValue('isFree', e.target.checked, { shouldValidate: true })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Yes, this event is free to attend
                    </label>
                  </div>
                </FormField>
                
                {!isFree && (
                  <FormField label="Ticket Price" error={errors.ticketPrice?.message}>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register('ticketPrice', { valueAsNumber: true })}
                        className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </FormField>
                )}
                
                <FormField label="Event Capacity (Optional)" error={errors.capacity?.message}>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      className="block w-full py-2 pl-3 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                      placeholder="Leave blank for unlimited capacity"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <Users size={16} className="text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </FormField>
                
                <FormField label="Ticket Options">
                  <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>}>
                    <TicketOptionsEditor 
                      isFree={isFree}
                      // FIX: This now saves the data to the form state.
                      // Before, it was just `console.log`.
                      onChange={(options) => setValue('ticketOptions', options, { shouldValidate: true })}
                    />
                  </Suspense>
                </FormField>
                
                <FormField label="Event Visibility">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublic"
                      type="checkbox"
                      // FIX: Removed `...register('isPublic')`
                      // `defaultValues` handles the initial state,
                      // and `Controller` or manual `setValue` is better.
                      // Using `register` here is fine, but for consistency...
                      // Let's use `setValue` like the other checkboxes.
                      checked={watch('isPublic')}
                      onChange={(e) => setValue('isPublic', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      List this event publicly
                    </label>
                  </div>
                </FormField>
                
                <FormField label="Organizer Information (Optional)" error={errors.organizerInfo?.message}>
                  <textarea
                    {...register('organizerInfo')}
                    rows={3}
                    className="block w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                    placeholder="Additional information about the organizer..."
                  />
                </FormField>
              </motion.div>
            )}
            
            {/* Step 4: Preview */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Event Preview</h2>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  {coverImage?.preview ? (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={coverImage.preview}
                        alt="Event cover"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">No cover image</p>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{watch('name') || 'Event Name'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{watch('shortDescription') || 'No short description provided'}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {watch('tags')?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <Calendar className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      <div className="ml-3 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">Date & Time</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {watch('startDate')?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {' '}
                          {watch('startDate')?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      <div className="ml-3 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">{isOnline ? 'Online Event' : 'Location'}</p>
                        <p className="text-gray-600 dark:text-gray-400">{watch('location') || 'No location provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Tag className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      <div className="ml-3 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">Category</p>
                        <p className="text-gray-600 dark:text-gray-400">{watch('category') || 'Uncategorized'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <DollarSign className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      <div className="ml-3 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">Price</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {isFree ? 'Free' : `$${watch('ticketPrice')?.toFixed(2) || '0.00'}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {watch('description') || 'No description provided'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={prevStep}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 ${
                currentStep === 0 
                  ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800 opacity-50' 
                  : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                // FIX: This button is now just a simple click handler.
                // The validation logic is inside `nextStep`.
                // We can't use `isStepValid(currentStep)` here because it's not async.
                // We *trust* `nextStep` to do the validation.
                // disabled={!isStepValid(currentStep)} // <-- Removed this
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700`}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                // FIX: `isValid` (from react-hook-form) now correctly checks
                // the *entire* form, including our schema refinement.
                disabled={isSubmitting || !isValid}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isSubmitting || !isValid
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            )}
          </div>
        </form>
        {/* FIX: Uncommented Toaster so toast messages can appear */}
        <Toaster richColors />
      </div>
    </div>
  )
}

export default CreateEventPage
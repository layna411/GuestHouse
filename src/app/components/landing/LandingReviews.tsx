import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { GuestReview } from './constants';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface LandingReviewsProps {
  reviewsList: GuestReview[];
  setReviewsList: React.Dispatch<React.SetStateAction<GuestReview[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  reviewForm: {
    advantages: string;
    disadvantages: string;
    month: string;
    year: string;
    rating: number;
    name: string;
    email: string;
    country: string;
  };
  setReviewForm: React.Dispatch<React.SetStateAction<{
    advantages: string;
    disadvantages: string;
    month: string;
    year: string;
    rating: number;
    name: string;
    email: string;
    country: string;
  }>>;
}

export function LandingReviews({
  reviewsList,
  setReviewsList,
  currentPage,
  setCurrentPage,
  reviewForm,
  setReviewForm
}: LandingReviewsProps) {
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.email.trim()) {
      toast.error("Please enter your name and email address");
      return;
    }

    const newRev: GuestReview = {
      id: Date.now().toString(),
      source: 'our',
      rating: reviewForm.rating,
      ratingText: reviewForm.rating >= 9 ? 'Exceptional' : reviewForm.rating >= 8 ? 'Wonderful' : reviewForm.rating >= 7 ? 'Good' : 'Satisfactory',
      reviewerName: reviewForm.name,
      reviewerCountry: reviewForm.country ? reviewForm.country.trim() : '🇮🇳',
      date: format(new Date(), 'd MMMM yyyy'),
      advantages: reviewForm.advantages.trim(),
      disadvantages: reviewForm.disadvantages.trim(),
    };

    setReviewsList(prev => [newRev, ...prev]);
    setCurrentPage(1);
    setReviewForm({
      advantages: '',
      disadvantages: '',
      month: 'Month',
      year: 'Year',
      rating: 10,
      name: '',
      email: '',
      country: '',
    });
    toast.success("Thank you for your feedback! Review posted successfully.");
  };

  // Review calculations
  const ourReviews = reviewsList.filter(r => r.source === 'our');
  const totalReviews = ourReviews.length;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalReviews / itemsPerPage);
  const startIndex = totalReviews > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, totalReviews);
  const currentReviews = ourReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const averageRating = totalReviews > 0
    ? (ourReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '10.0';

  return (
    <section id="reviews" className="relative py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
      
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground">
          Reviews
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-6"></div>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Find out what other guests say about Saveetha GuestHouse! For your convenience, we have collected the reviews from our guests.
        </p>
      </div>

      {/* Main Grid: Left = List of Reviews, Right = Send Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: List of Reviews (Span 2) */}
        <div className="lg:col-span-2 border border-border/40 rounded-2xl overflow-hidden bg-card shadow-lg flex flex-col">
          
          {/* Tab Content Header (Overall rating stats) */}
          <div className="p-6 bg-white dark:bg-card border-b border-border">
            {/* Top Row */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-foreground">100% Verified Reviews</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">{averageRating}</span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
            </div>
            
            {/* Divider Line */}
            <div className="border-t border-border/60 my-3"></div>
            
            {/* Bottom Row */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  Saveetha GuestHouse Booking
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                Showing {startIndex} - {endIndex} of {totalReviews}
              </span>
            </div>
          </div>

          {/* List of Reviews scrollable container */}
          <div className="p-6 divide-y divide-border/20 max-h-[500px] overflow-y-auto space-y-6 bg-white dark:bg-card">
            {currentReviews.map((review) => (
              <div key={review.id} className="pt-6 first:pt-0 space-y-4 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* Rating Square Badge (Booking.com style) */}
                    <div className="w-9 h-9 rounded-lg bg-[#0a2239] dark:bg-accent text-white dark:text-accent-foreground font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      {review.rating}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{review.ratingText}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-semibold">
                        <span className="text-sm">{review.reviewerCountry}</span>
                        <span>{review.reviewerName}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pl-1">
                  {/* Advantages */}
                  {review.advantages && review.advantages.trim() && (
                    <div className="flex items-start gap-2.5 text-xs font-semibold text-foreground/80 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-[#4bd395] text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">+</span>
                      <p>{review.advantages}</p>
                    </div>
                  )}
                  {/* Disadvantages */}
                  {review.disadvantages && review.disadvantages.trim() && (
                    <div className="flex items-start gap-2.5 text-xs font-semibold text-muted-foreground leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">-</span>
                      <p>{review.disadvantages}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {currentReviews.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm font-semibold">
                No reviews submitted yet. Be the first to leave one!
              </div>
            )}
          </div>

          {/* Pagination footer */}
          <div className="border-t border-border bg-secondary/15 p-4 flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-full border border-border flex items-center justify-center transition-all ${
                currentPage === 1 
                  ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                  : 'hover:bg-secondary text-foreground cursor-pointer bg-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'border border-border bg-white text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-1.5 rounded-full border border-border flex items-center justify-center transition-all ${
                currentPage === totalPages || totalPages === 0
                  ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                  : 'hover:bg-secondary text-foreground cursor-pointer bg-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT: Send a Review Form */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg flex flex-col">
          <div className="p-5 border-b border-border bg-white dark:bg-card text-left">
            <h3 className="font-serif text-lg font-bold text-foreground">Send a review</h3>
          </div>

          <form
            onSubmit={handleSubmitReview}
            className="p-6 space-y-5 text-left bg-white dark:bg-card flex-1"
          >
            <div className="space-y-4">
              <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-800 dark:text-accent border-b border-border/40 pb-1.5">
                Share your impressions
              </span>

              {/* Advantages */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Advantages</label>
                <textarea
                  rows={2}
                  value={reviewForm.advantages}
                  onChange={(e) => setReviewForm({ ...reviewForm, advantages: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium"
                  placeholder="Type your review here..."
                />
              </div>

              {/* Disadvantages */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Disadvantages</label>
                <textarea
                  rows={2}
                  value={reviewForm.disadvantages}
                  onChange={(e) => setReviewForm({ ...reviewForm, disadvantages: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium"
                  placeholder="Type your review here..."
                />
              </div>

              {/* Time of stay dropdowns */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Time of stay</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={reviewForm.month}
                    onChange={(e) => setReviewForm({ ...reviewForm, month: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-medium"
                  >
                    <option value="Month">Month</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={reviewForm.year}
                    onChange={(e) => setReviewForm({ ...reviewForm, year: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-medium"
                  >
                    <option value="Year">Year</option>
                    {['2026', '2025', '2024'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating Points (1-10) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Your rating point</label>
                <div className="grid grid-cols-10 border border-border/80 rounded-lg overflow-hidden divide-x divide-border">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((point) => (
                    <button
                      key={point}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: point })}
                      className={`py-2 text-center text-xs font-bold transition-all cursor-pointer ${
                        reviewForm.rating === point
                          ? 'bg-slate-800 text-white font-black'
                          : 'bg-white hover:bg-secondary text-muted-foreground hover:text-foreground dark:bg-card'
                      }`}
                    >
                      {point}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-extrabold uppercase text-muted-foreground px-0.5">
                  <span>Awful</span>
                  <span>Awesome</span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4 pt-3 border-t border-border">
              <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-800 dark:text-accent border-b border-border/40 pb-1.5">
                Please enter your details
              </span>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Name"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Email</label>
                <input
                  type="email"
                  value={reviewForm.email}
                  onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                  placeholder="Email"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Where are you from?</label>
                <input
                  type="text"
                  value={reviewForm.country}
                  onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                  placeholder="Country"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                />
              </div>
            </div>

            {/* Send Pill Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="w-1/2 text-center bg-[#4bd395] hover:bg-[#3dbf83] text-white font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                SEND
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}

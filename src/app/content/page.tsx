'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ImageUploader } from '@/components/ui/ImageUploader';
import {
  DEFAULT_COLLECTIONS,
  DEFAULT_CUSTOM_CATEGORIES,
  DEFAULT_GEMSTONES,
  DEFAULT_PLANS,
  DEFAULT_SITE_SECTIONS,
  DEFAULT_TESTIMONIALS,
} from '@/lib/default-content';
import {
  CollectionItem,
  CustomCategoryItem,
  GemstoneItem,
  PlanItem,
  SiteSectionContent,
  TestimonialItem,
} from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

const SECTIONS_NAV = [
  { id: 'hero', label: '1. Hero Section' },
  { id: 'collections', label: '2. Shop Collections' },
  { id: 'philosophy', label: '3. Brand Philosophy' },
  { id: 'founder', label: '4. Meet The Founder' },
  { id: 'custom', label: '5. Custom Jewellery' },
  { id: 'heritage', label: '6. Heritage Redesign' },
  { id: 'gemstones', label: '7. Gemstones Showcase' },
  { id: 'testimonials', label: '8. Testimonials' },
  { id: 'plans', label: '9. Consultation Plans' },
  { id: 'footer', label: '10. Footer & Contact' },
];

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [sections, setSections] = useState<Record<string, SiteSectionContent>>(
    DEFAULT_SITE_SECTIONS
  );
  const [collections, setCollections] =
    useState<CollectionItem[]>(DEFAULT_COLLECTIONS);
  const [customCategories, setCustomCategories] = useState<
    CustomCategoryItem[]
  >(DEFAULT_CUSTOM_CATEGORIES);
  const [gemstones, setGemstones] =
    useState<GemstoneItem[]>(DEFAULT_GEMSTONES);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load from Supabase if configured
  useEffect(() => {
    async function loadRemoteContent() {
      if (!isSupabaseConfigured()) return;

      try {
        const [
          secRes,
          colRes,
          custRes,
          gemRes,
          testRes,
          planRes,
        ] = await Promise.all([
          supabase.from('site_content').select('*'),
          supabase.from('collections').select('*').order('sort_order'),
          supabase.from('custom_categories').select('*').order('sort_order'),
          supabase.from('gemstones').select('*').order('sort_order'),
          supabase.from('testimonials').select('*').order('sort_order'),
          supabase.from('plans').select('*').order('sort_order'),
        ]);

        if (secRes.data && secRes.data.length > 0) {
          const map = { ...DEFAULT_SITE_SECTIONS };
          secRes.data.forEach((s) => {
            map[s.id] = s;
          });
          setSections(map);
        }
        if (colRes.data && colRes.data.length > 0) setCollections(colRes.data);
        if (custRes.data && custRes.data.length > 0)
          setCustomCategories(custRes.data);
        if (gemRes.data && gemRes.data.length > 0) setGemstones(gemRes.data);
        if (testRes.data && testRes.data.length > 0)
          setTestimonials(testRes.data);
        if (planRes.data && planRes.data.length > 0) setPlans(planRes.data);
      } catch (err) {
        console.error('Error fetching Supabase content:', err);
      }
    }
    loadRemoteContent();
  }, []);

  const handleSaveSection = async (sectionId: string) => {
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      if (isSupabaseConfigured()) {
        const sectionData = sections[sectionId];
        const { error } = await supabase
          .from('site_content')
          .upsert({
            id: sectionId,
            section_name: sectionData.section_name,
            title: sectionData.title,
            subtitle: sectionData.subtitle,
            description: sectionData.description,
            image_url: sectionData.image_url,
            data: sectionData.data,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setSaveSuccess(
        `Changes saved for ${sections[sectionId]?.section_name || sectionId}!`
      );
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || 'Failed to save to Supabase.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleSaveCollections = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      if (isSupabaseConfigured()) {
        for (const col of collections) {
          await supabase.from('collections').upsert({
            ...col,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setSaveSuccess('Shop Collections saved successfully!');
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save collections.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleSaveCustomCategories = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      if (isSupabaseConfigured()) {
        for (const cat of customCategories) {
          await supabase.from('custom_categories').upsert({
            ...cat,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setSaveSuccess('Custom Jewellery categories saved!');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleSaveGemstones = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      if (isSupabaseConfigured()) {
        for (const gem of gemstones) {
          await supabase.from('gemstones').upsert({
            ...gem,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setSaveSuccess('Gemstones showcase saved!');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleSaveTestimonials = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      if (isSupabaseConfigured()) {
        for (const t of testimonials) {
          await supabase.from('testimonials').upsert({
            ...t,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setSaveSuccess('Client Testimonials saved!');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleSavePlans = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      if (isSupabaseConfigured()) {
        for (const p of plans) {
          await supabase.from('plans').upsert({
            ...p,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setSaveSuccess('Consultation Plans saved!');
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Website Content & Media Studio"
        subtitle="Live edit titles, copywriting, and upload high-resolution images to Supabase for the frontend"
        action={
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <span>Preview Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>
          </div>
        }
      />

      {/* Save alerts */}
      {saveSuccess && (
        <div className="mx-8 mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="mx-8 mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Subnav */}
        <div className="lg:col-span-3 space-y-1 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/80 sticky top-24">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
            Website Sections
          </div>
          {SECTIONS_NAV.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === sec.id
                  ? 'bg-[#d4af37]/20 text-[#f5e6a3] border border-[#d4af37]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Right Editor Pane */}
        <div className="lg:col-span-9 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-8">
          {/* ================= SECTION 1: HERO ================= */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Hero Section
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    First luxury impression visible when visitors load the Aurumm landing page
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('hero')}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Heading Line 1 (White uppercase)
                  </label>
                  <input
                    type="text"
                    value={sections.hero.data?.heading_line1 || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          data: {
                            ...sections.hero.data,
                            heading_line1: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#d4af37] block mb-1">
                    Heading Line 2 (Gold accent)
                  </label>
                  <input
                    type="text"
                    value={sections.hero.data?.heading_line2 || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          data: {
                            ...sections.hero.data,
                            heading_line2: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Description / Philosophy Hook
                </label>
                <textarea
                  rows={3}
                  value={sections.hero.description || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={sections.hero.data?.cta1_label || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          data: {
                            ...sections.hero.data,
                            cta1_label: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={sections.hero.data?.cta2_label || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          data: {
                            ...sections.hero.data,
                            cta2_label: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                label="Hero Background / Ambient Visual"
                value={sections.hero.image_url || ''}
                onChange={(url) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, image_url: url },
                  })
                }
                folder="hero"
              />
            </div>
          )}

          {/* ================= SECTION 2: COLLECTIONS (SHOP GRID) ================= */}
          {activeTab === 'collections' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Shop Collections
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Luxury collection tiles rendered in the ShopGrid section
                  </p>
                </div>
                <button
                  onClick={handleSaveCollections}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Collections'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {collections.map((col, index) => (
                  <div
                    key={col.id}
                    className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#d4af37]">
                        Collection Item #{index + 1}
                      </span>
                      <button
                        onClick={() =>
                          setCollections(
                            collections.filter((_, i) => i !== index)
                          )
                        }
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                          Collection Title
                        </label>
                        <input
                          type="text"
                          value={col.title}
                          onChange={(e) => {
                            const updated = [...collections];
                            updated[index].title = e.target.value;
                            setCollections(updated);
                          }}
                          className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                          Collection Badge
                        </label>
                        <input
                          type="text"
                          value={col.badge || ''}
                          onChange={(e) => {
                            const updated = [...collections];
                            updated[index].badge = e.target.value;
                            setCollections(updated);
                          }}
                          className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                          Target Anchor Link
                        </label>
                        <input
                          type="text"
                          value={col.link || '#custom'}
                          onChange={(e) => {
                            const updated = [...collections];
                            updated[index].link = e.target.value;
                            setCollections(updated);
                          }}
                          className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={col.description}
                        onChange={(e) => {
                          const updated = [...collections];
                          updated[index].description = e.target.value;
                          setCollections(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <ImageUploader
                      label={`Image for "${col.title}"`}
                      value={col.image_url}
                      onChange={(url) => {
                        const updated = [...collections];
                        updated[index].image_url = url;
                        setCollections(updated);
                      }}
                      folder="collections"
                    />
                  </div>
                ))}

                <button
                  onClick={() =>
                    setCollections([
                      ...collections,
                      {
                        id: 'col-' + Date.now(),
                        title: 'New Jewellery Line',
                        description: 'Handcrafted luxury piece in 18k solid gold.',
                        badge: 'New Arrival',
                        link: '#custom',
                        image_url: '/Engagement Rings.png',
                        sort_order: collections.length + 1,
                        is_active: true,
                      },
                    ])
                  }
                  className="w-full py-3 rounded-xl border border-dashed border-neutral-800 hover:border-[#d4af37]/60 text-neutral-400 hover:text-[#d4af37] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Collection Card</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: PHILOSOPHY ================= */}
          {activeTab === 'philosophy' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Brand Philosophy Section
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Story, core values, and luxury credibility metrics
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('philosophy')}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Eyebrow / Subtitle
                  </label>
                  <input
                    type="text"
                    value={sections.philosophy.subtitle || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        philosophy: {
                          ...sections.philosophy,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={sections.philosophy.title || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        philosophy: {
                          ...sections.philosophy,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Philosophy Paragraph
                </label>
                <textarea
                  rows={4}
                  value={sections.philosophy.description || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      philosophy: {
                        ...sections.philosophy,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none leading-relaxed"
                />
              </div>

              <ImageUploader
                label="Philosophy Feature 3D Frame Image"
                value={sections.philosophy.image_url || ''}
                onChange={(url) =>
                  setSections({
                    ...sections,
                    philosophy: { ...sections.philosophy, image_url: url },
                  })
                }
                folder="philosophy"
              />

              {/* Stats cards editor */}
              <div>
                <label className="text-xs font-medium text-[#d4af37] block mb-2">
                  Statistics Highlight Cards
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(sections.philosophy.data?.stats || []).map(
                    (stat: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2"
                      >
                        <input
                          type="text"
                          value={stat.value}
                          placeholder="500+"
                          onChange={(e) => {
                            const currentStats = sections.philosophy.data?.stats || [];
                            const newStats = [...currentStats];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            setSections({
                              ...sections,
                              philosophy: {
                                ...sections.philosophy,
                                data: {
                                  ...(sections.philosophy.data || {}),
                                  stats: newStats,
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1 text-sm font-semibold bg-neutral-900 border border-neutral-800 rounded text-[#d4af37] text-center"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          placeholder="Label"
                          onChange={(e) => {
                            const currentStats = sections.philosophy.data?.stats || [];
                            const newStats = [...currentStats];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            setSections({
                              ...sections,
                              philosophy: {
                                ...sections.philosophy,
                                data: {
                                  ...(sections.philosophy.data || {}),
                                  stats: newStats,
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1 text-[11px] bg-neutral-900 border border-neutral-800 rounded text-neutral-300 text-center"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: FOUNDER ================= */}
          {activeTab === 'founder' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Meet The Founder
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Founder portrait, background bio, and gemstone certifications
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('founder')}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Founder Full Name
                  </label>
                  <input
                    type="text"
                    value={sections.founder.data?.founder_name || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        founder: {
                          ...sections.founder,
                          data: {
                            ...sections.founder.data,
                            founder_name: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#d4af37] block mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={sections.founder.data?.founder_title || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        founder: {
                          ...sections.founder,
                          data: {
                            ...sections.founder.data,
                            founder_title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Signature Quote
                </label>
                <input
                  type="text"
                  value={sections.founder.data?.quote || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      founder: {
                        ...sections.founder,
                        data: {
                          ...sections.founder.data,
                          quote: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Founder Biography & Vision
                </label>
                <textarea
                  rows={4}
                  value={sections.founder.description || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      founder: {
                        ...sections.founder,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none leading-relaxed"
                />
              </div>

              <ImageUploader
                label="Founder Portrait Image"
                value={sections.founder.image_url || ''}
                onChange={(url) =>
                  setSections({
                    ...sections,
                    founder: { ...sections.founder, image_url: url },
                  })
                }
                folder="founder"
              />
            </div>
          )}

          {/* ================= SECTION 5: CUSTOM JEWELLERY ================= */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Custom Jewellery Categories
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Engagement & Wedding, Statement Pieces, and Everyday Luxury cards
                  </p>
                </div>
                <button
                  onClick={handleSaveCustomCategories}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Categories'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {customCategories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                          Category Title
                        </label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const updated = [...customCategories];
                            updated[idx].title = e.target.value;
                            setCustomCategories(updated);
                          }}
                          className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={cat.badge || ''}
                          onChange={(e) => {
                            const updated = [...customCategories];
                            updated[idx].badge = e.target.value;
                            setCustomCategories(updated);
                          }}
                          className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                        Category Description
                      </label>
                      <input
                        type="text"
                        value={cat.description}
                        onChange={(e) => {
                          const updated = [...customCategories];
                          updated[idx].description = e.target.value;
                          setCustomCategories(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <ImageUploader
                      label={`Category Image for "${cat.title}"`}
                      value={cat.image_url}
                      onChange={(url) => {
                        const updated = [...customCategories];
                        updated[idx].image_url = url;
                        setCustomCategories(updated);
                      }}
                      folder="custom-jewellery"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 6: HERITAGE REDESIGN ================= */}
          {activeTab === 'heritage' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Heritage Redesign
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Interactive Before & After slider images and heirloom transformation copy
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('heritage')}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={sections.heritage.title || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      heritage: { ...sections.heritage, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={sections.heritage.description || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      heritage: {
                        ...sections.heritage,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Before Image (Ancestral / Vintage Piece)"
                  value={sections.heritage.data?.before_image || ''}
                  onChange={(url) =>
                    setSections({
                      ...sections,
                      heritage: {
                        ...sections.heritage,
                        data: {
                          ...sections.heritage.data,
                          before_image: url,
                        },
                      },
                    })
                  }
                  folder="heritage"
                />
                <ImageUploader
                  label="After Image (Modern Custom Redesign)"
                  value={sections.heritage.data?.after_image || ''}
                  onChange={(url) =>
                    setSections({
                      ...sections,
                      heritage: {
                        ...sections.heritage,
                        data: {
                          ...sections.heritage.data,
                          after_image: url,
                        },
                      },
                    })
                  }
                  folder="heritage"
                />
              </div>
            </div>
          )}

          {/* ================= SECTION 7: GEMSTONES ================= */}
          {activeTab === 'gemstones' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Gemstones Showcase
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Astrological planets, descriptions, and high-res gemstone images
                  </p>
                </div>
                <button
                  onClick={handleSaveGemstones}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Gemstones'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gemstones.map((gem, idx) => (
                  <div
                    key={gem.id}
                    className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Gemstone Name
                        </label>
                        <input
                          type="text"
                          value={gem.name}
                          onChange={(e) => {
                            const updated = [...gemstones];
                            updated[idx].name = e.target.value;
                            setGemstones(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Vedic Planet
                        </label>
                        <input
                          type="text"
                          value={gem.planet || ''}
                          onChange={(e) => {
                            const updated = [...gemstones];
                            updated[idx].planet = e.target.value;
                            setGemstones(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                        Astrological Description
                      </label>
                      <input
                        type="text"
                        value={gem.description}
                        onChange={(e) => {
                          const updated = [...gemstones];
                          updated[idx].description = e.target.value;
                          setGemstones(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                      />
                    </div>

                    <ImageUploader
                      label={`${gem.name} Gemstone Photo`}
                      value={gem.image_url}
                      onChange={(url) => {
                        const updated = [...gemstones];
                        updated[idx].image_url = url;
                        setGemstones(updated);
                      }}
                      folder="gemstones"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 8: TESTIMONIALS ================= */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Client Testimonials
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Client stories, locations, and high-jewelry commission photos
                  </p>
                </div>
                <button
                  onClick={handleSaveTestimonials}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Testimonials'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {testimonials.map((test, idx) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={test.client_name}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].client_name = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          City / Location
                        </label>
                        <input
                          type="text"
                          value={test.location || ''}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].location = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Jewellery Piece Created
                        </label>
                        <input
                          type="text"
                          value={test.piece_created || ''}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].piece_created = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                        Client Review Quote
                      </label>
                      <textarea
                        rows={3}
                        value={test.quote}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[idx].quote = e.target.value;
                          setTestimonials(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white leading-relaxed"
                      />
                    </div>

                    <ImageUploader
                      label={`Photo of piece created for ${test.client_name}`}
                      value={test.image_url || ''}
                      onChange={(url) => {
                        const updated = [...testimonials];
                        updated[idx].image_url = url;
                        setTestimonials(updated);
                      }}
                      folder="testimonials"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 9: PLANS ================= */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Consultation Plans & Tiers
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Discovery, Creation, and Heritage pricing tiers
                  </p>
                </div>
                <button
                  onClick={handleSavePlans}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Plans'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {plans.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Plan Label
                        </label>
                        <input
                          type="text"
                          value={p.label}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].label = e.target.value;
                            setPlans(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#d4af37] font-medium block mb-1">
                          Price
                        </label>
                        <input
                          type="text"
                          value={p.price}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].price = e.target.value;
                            setPlans(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                          Button CTA
                        </label>
                        <input
                          type="text"
                          value={p.cta}
                          onChange={(e) => {
                            const updated = [...plans];
                            updated[idx].cta = e.target.value;
                            setPlans(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-medium block mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={p.description}
                        onChange={(e) => {
                          const updated = [...plans];
                          updated[idx].description = e.target.value;
                          setPlans(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 10: FOOTER & CONTACT ================= */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Footer & Contact Info
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Studio address, direct telephone, booking email, and social links
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('footer')}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Primary Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={sections.footer.data?.phone || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        footer: {
                          ...sections.footer,
                          data: {
                            ...sections.footer.data,
                            phone: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Studio Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={sections.footer.data?.email || ''}
                    onChange={(e) =>
                      setSections({
                        ...sections,
                        footer: {
                          ...sections.footer,
                          data: {
                            ...sections.footer.data,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Physical Studio Address
                </label>
                <input
                  type="text"
                  value={sections.footer.data?.address || ''}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      footer: {
                        ...sections.footer,
                        data: {
                          ...sections.footer.data,
                          address: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Studio Brand Logo"
                value={sections.footer.image_url || ''}
                onChange={(url) =>
                  setSections({
                    ...sections,
                    footer: { ...sections.footer, image_url: url },
                  })
                }
                folder="branding"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

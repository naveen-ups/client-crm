'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Gem,
  CheckCircle2,
  Clock,
  ChevronRight,
  Save,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { INITIAL_DEMO_LEADS } from '@/lib/default-content';
import { Lead, LeadStatus } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

const STATUS_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'converted', label: 'Converted' },
  { id: 'archived', label: 'Archived' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_gemstone: '',
    budget_range: '',
    message: '',
  });

  useEffect(() => {
    async function fetchLeads() {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setLeads(data);
        }
      }
    }
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      activeStatusFilter === 'all' ? true : lead.status === activeStatusFilter;
    const matchesSearch =
      searchQuery === ''
        ? true
        : lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery) ||
          (lead.preferred_gemstone &&
            lead.preferred_gemstone
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDraft(lead.consultant_notes || '');
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (isSupabaseConfigured()) {
      await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNote(true);

    const updated = { ...selectedLead, consultant_notes: notesDraft };
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? updated : l))
    );
    setSelectedLead(updated);

    if (isSupabaseConfigured()) {
      await supabase
        .from('leads')
        .update({
          consultant_notes: notesDraft,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedLead.id);
    }

    setTimeout(() => {
      setIsSavingNote(false);
    }, 400);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email || !newLeadForm.phone) return;

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      name: newLeadForm.name,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      message: newLeadForm.message,
      preferred_gemstone: newLeadForm.preferred_gemstone,
      budget_range: newLeadForm.budget_range,
      status: 'new',
      source: 'CRM Manual Entry',
      created_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    setShowNewModal(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      preferred_gemstone: '',
      budget_range: '',
      message: '',
    });

    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from('leads')
        .insert([
          {
            name: newLead.name,
            email: newLead.email,
            phone: newLead.phone,
            message: newLead.message,
            preferred_gemstone: newLead.preferred_gemstone,
            budget_range: newLead.budget_range,
            status: 'new',
            source: 'CRM Manual Entry',
          },
        ])
        .select()
        .single();
      if (data) {
        setLeads((prev) => [data, ...prev.slice(1)]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Consultation Inquiries & Leads"
        subtitle="Manage client consultations, gemstone preferences, and booking follow-ups"
        action={
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add In-Studio Lead</span>
          </button>
        }
      />

      <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, or gemstone..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeStatusFilter === tab.id
                    ? 'bg-[#d4af37]/20 text-[#f5e6a3] border border-[#d4af37]/40'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Leads List & Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List column */}
          <div className="lg:col-span-7 space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-500 text-sm">
                No inquiries found matching this criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/5'
                        : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-100 text-sm">
                            {lead.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                              lead.status === 'new'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : lead.status === 'scheduled'
                                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                : lead.status === 'contacted'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
                          <span>{lead.email}</span>
                          <span className="text-neutral-600">•</span>
                          <span>{lead.phone}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0 text-[11px] text-neutral-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {lead.message && (
                      <p className="text-xs text-neutral-400/90 mt-2.5 bg-black/30 p-2.5 rounded-lg border border-neutral-800/60 line-clamp-2">
                        &ldquo;{lead.message}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-800/60 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Gem className="w-3 h-3 text-[#d4af37]" />
                        {lead.preferred_gemstone || 'Bespoke Jewelry'}
                      </span>
                      <span className="text-[#d4af37] flex items-center gap-0.5">
                        View profile <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Details pane column */}
          <div className="lg:col-span-5 sticky top-24">
            {selectedLead ? (
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-white">
                      {selectedLead.name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Lead ID: <span className="font-mono">{selectedLead.id}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Contact Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mb-1" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4 mb-1" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${selectedLead.email}?subject=Aurumm Consultation Follow-up`}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4 mb-1" />
                    <span>Email</span>
                  </a>
                </div>

                {/* Status selector */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium block mb-2">
                    Consultation Status
                  </label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedLead.id,
                        e.target.value as LeadStatus
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="new">New (Needs follow-up)</option>
                    <option value="contacted">Contacted (WhatsApp/Call sent)</option>
                    <option value="scheduled">Scheduled (Session booked)</option>
                    <option value="in_progress">In Progress (Design & CAD)</option>
                    <option value="converted">Converted (Piece Commissioned)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Lead inquiry message */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium block mb-1.5">
                    Original Request Message
                  </label>
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
                    {selectedLead.message || 'No message entered'}
                  </div>
                </div>

                {/* Consultant Private Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                      Consultant Notes & Specs
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      Internal only
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Record client gemstone budget, astrological considerations, ring size, meeting notes..."
                    className="w-full p-3 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNote}
                    className="mt-2 w-full py-2 rounded-xl bg-neutral-800 hover:bg-[#d4af37] hover:text-black text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNote ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-dashed border-neutral-800 text-neutral-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                <p className="text-xs">
                  Select an inquiry from the list to view contact options and consultant notes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Lead Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Add In-Studio / Phone Lead
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">
                  Interested Gemstone / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yellow Sapphire, Heirloom Polki..."
                  value={newLeadForm.preferred_gemstone}
                  onChange={(e) =>
                    setNewLeadForm({
                      ...newLeadForm,
                      preferred_gemstone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">
                  Initial Notes
                </label>
                <textarea
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, message: e.target.value })
                  }
                  placeholder="Details from phone conversation or boutique visit..."
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#d4af37] text-xs font-semibold text-black hover:bg-[#b8952a]"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

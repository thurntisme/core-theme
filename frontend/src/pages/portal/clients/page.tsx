'use client';

import { useState } from 'react';

import { Building, Plus, Search, SearchIcon } from 'lucide-react';

import ClientList from '@/components/p/client-list';
import EditClientDialog from '@/components/p/edit-client-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Client } from '@/types/portal';
import { useQuery } from '@tanstack/react-query';

const initFormData: Client = {
  id: '',
  name: '',
  email: '',
  company: '',
  website: '',
  notes: '',
};

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Client>(initFormData);

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch('/api/portal/client');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      return response.json();
    },
  });

  const resetForm = () => {
    setFormData(initFormData);
  };

  const handleSaveClient = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required!');
      return;
    }

    if (!editingClient) {
      const newClient: Client = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Adding new client:', newClient);
    } else {
      console.log('Updating client:', { ...editingClient, ...formData });
    }

    resetForm();
    setEditingClient(null);
    setIsClientDialogOpen(false);
  };

  const handleDeleteClient = (clientId: string) => {
    console.log('Deleting client with ID:', clientId);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      ...client,
      name: client.name,
      email: client.email,
      company: client.company,
      website: client.website,
      notes: client.notes,
    });
    setIsClientDialogOpen(true);
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingClient(null);
    setIsClientDialogOpen(false);
  };

  const handleOpenClientDialog = () => {
    setFormData(initFormData);
    setIsClientDialogOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">
            Manage your client information and contacts
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleOpenClientDialog}
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Button className="px-3 py-1">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading clients...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading clients.</p>
        </div>
      )}

      {!isLoading && !error && clients && (
        <>
          {/* Clients Grid */}
          {clients.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Building className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Get started by adding your first client'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsClientDialogOpen(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <ClientList
              clients={clients}
              openEditDialog={openEditDialog}
              onDeleteClient={handleDeleteClient}
            />
          )}
        </>
      )}

      {/* Edit Dialog */}
      <EditClientDialog
        isDialogOpen={isClientDialogOpen}
        setIsDialogOpen={setIsClientDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSaveClient={handleSaveClient}
        onCancelEdit={handleCancelEdit}
      />
    </main>
  );
}

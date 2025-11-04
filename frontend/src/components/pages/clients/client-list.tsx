import React from 'react';

import {
  Building,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ConfirmDeleteBtn from '@/components/ui/confirm-delete-btn';
import type { Client } from '@/types/portal';

type Props = {
  clients: Client[];
  openEditDialog: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
};

const ClientList = ({ clients, openEditDialog, onDeleteClient }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client: Client) => (
        <Card key={client.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                {client.company && (
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building className="h-3 w-3" />
                    {client.company}
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(client)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <ConfirmDeleteBtn
                  title="Delete Client"
                  message={`Are you sure you want to delete ${client.name}?
                                This action cannot be undone.`}
                  action={() => onDeleteClient(client.id)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-3 w-3" />
              <a
                href={`mailto:${client.email}`}
                className="hover:text-blue-600 transition-colors"
              >
                {client.email}
              </a>
            </div>

            {client.website && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-3 w-3" />
                <a
                  href={
                    client.website.startsWith('http')
                      ? client.website
                      : `https://${client.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {client.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {client.notes && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-2">{client.notes}</p>
              </div>
            )}

            {client.createdAt && (
              <div className="pt-2 border-t text-xs text-gray-400">
                Added {new Date(client.createdAt).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientList;

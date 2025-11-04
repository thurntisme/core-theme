'use client';

import { useNavigate } from 'react-router-dom';

import { ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PORTAL_URL } from '@/constants/site';
import { toolCategories } from '@/constants/tools';
import { addPoints } from '@/lib/point';
import type { PortalTool } from '@/types/portal';

export default function DashboardPage() {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleToolClick = (tool: PortalTool) => {
    if (tool.status === 'active' && tool.link) {
      // Award points for using tools
      addPoints(`Opened ${tool.name}`, 2);

      if (tool.link.startsWith('/')) {
        navigate(`${PORTAL_URL}/${tool.link}`);
      } else {
        window.open(tool.link, '_blank');
      }
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, Welcome back! 👋
        </h2>
        <p className="text-gray-600">
          Here's your freelancer toolkit. Choose a tool to get started with your
          work.
        </p>
      </div>

      {/* Tools Grid by Category */}
      <div className="space-y-12">
        {toolCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card
                    key={tool.description}
                    className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col"
                  >
                    <CardHeader className="pb-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 rounded-lg ${tool.color} text-white`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge
                          variant={
                            tool.status === 'active' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {tool.status === 'active' ? 'Active' : 'Coming Soon'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <CardDescription className="text-sm text-gray-600 mb-4">
                        {tool.description}
                      </CardDescription>
                      <Button
                        variant={
                          tool.status === 'active' ? 'default' : 'secondary'
                        }
                        size="sm"
                        className="w-full mt-auto"
                        disabled={tool.status !== 'active'}
                        onClick={() => handleToolClick(tool)}
                      >
                        {tool.status === 'active' ? (
                          <>
                            Open Tool
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </>
                        ) : (
                          'Coming Soon'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {toolCategories.reduce(
                (total, category) =>
                  total +
                  category.tools.filter((tool) => tool.status === 'active')
                    .length,
                0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {toolCategories.reduce(
                (total, category) =>
                  total +
                  category.tools.filter((tool) => tool.status === 'coming-soon')
                    .length,
                0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {toolCategories.reduce(
                (total, category) => total + category.tools.length,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

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
import type { PortalTool } from '@/types/portal';

type Props = {};

const ToolsGrid = (props: Props) => {
  const navigate = useNavigate();

  const handleClick = (tool: PortalTool) => {
    if (tool.status === 'active' && tool.slug && tool.slug !== '#') {
      navigate(`${PORTAL_URL}/${tool.slug}`);
    }
  };

  return (
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
                      onClick={() => handleClick(tool)}
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
  );
};

export default ToolsGrid;

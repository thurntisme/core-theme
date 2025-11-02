'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  Bell,
  Database,
  Download,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Shield,
  Sun,
  Upload,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Settings {
  profile: {
    fullName: string;
    email: string;
    bio: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    taskReminders: boolean;
    habitReminders: boolean;
    workoutReminders: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    compactMode: boolean;
    showPoints: boolean;
    showStreaks: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityVisibility: 'public' | 'friends' | 'private';
    dataSharing: boolean;
    analytics: boolean;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

const defaultSettings: Settings = {
  profile: {
    fullName: '',
    email: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    habitReminders: true,
    workoutReminders: true,
    dailyDigest: false,
    weeklyReport: true,
  },
  appearance: {
    theme: 'system',
    accentColor: 'blue',
    compactMode: false,
    showPoints: true,
    showStreaks: true,
  },
  privacy: {
    profileVisibility: 'private',
    activityVisibility: 'private',
    dataSharing: false,
    analytics: true,
  },
  data: {
    autoBackup: true,
    backupFrequency: 'weekly',
  },
};

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const accentColors = [
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
];

// Points system helper
const addPoints = (action: string, points: number) => {
  const currentPoints = 0;
  console.log(`Points added: ${currentPoints + points} for action: ${action}`);
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    loadSettings();
  }, [router]);

  const loadSettings = () => {
    const savedSettings = '';
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      addPoints('Updated settings', 5);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const allData = {
      settings,
      plannedExpenses: [],
      realExpenses: [],
      clients: [],
      projects: [],
      tasks: [],
      todos: [],
      bookmarks: [],
      habits: [],
      workouts: [],
      quickLinks: [],
      activities: [],
      points: [],
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freelancer-portal-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addPoints('Exported data', 3);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        console.log('Imported data:', importedData);

        addPoints('Imported data', 5);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    setSettings(defaultSettings);
    alert('All data has been reset!');
  };

  const updateSettings = (
    section: keyof Settings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.profile.fullName}
                      onChange={(e) =>
                        updateSettings('profile', 'fullName', e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) =>
                        updateSettings('profile', 'email', e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.profile.bio}
                    onChange={(e) =>
                      updateSettings('profile', 'bio', e.target.value)
                    }
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.profile.timezone}
                      onValueChange={(value) =>
                        updateSettings('profile', 'timezone', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.profile.language}
                      onValueChange={(value) =>
                        updateSettings('profile', 'language', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about important events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'emailNotifications',
                            checked
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'pushNotifications',
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Reminders</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="taskReminders">Task Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Get reminded about upcoming tasks
                        </p>
                      </div>
                      <Switch
                        id="taskReminders"
                        checked={settings.notifications.taskReminders}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'taskReminders',
                            checked
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="habitReminders">Habit Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Get reminded to complete your habits
                        </p>
                      </div>
                      <Switch
                        id="habitReminders"
                        checked={settings.notifications.habitReminders}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'habitReminders',
                            checked
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="workoutReminders">
                          Workout Reminders
                        </Label>
                        <p className="text-sm text-gray-600">
                          Get reminded about your workout schedule
                        </p>
                      </div>
                      <Switch
                        id="workoutReminders"
                        checked={settings.notifications.workoutReminders}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'workoutReminders',
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Digest</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dailyDigest">Daily Digest</Label>
                        <p className="text-sm text-gray-600">
                          Receive a daily summary of your activities
                        </p>
                      </div>
                      <Switch
                        id="dailyDigest"
                        checked={settings.notifications.dailyDigest}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'dailyDigest',
                            checked
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReport">Weekly Report</Label>
                        <p className="text-sm text-gray-600">
                          Receive a weekly progress report
                        </p>
                      </div>
                      <Switch
                        id="weeklyReport"
                        checked={settings.notifications.weeklyReport}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            'notifications',
                            'weeklyReport',
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance & Theme</CardTitle>
                <CardDescription>
                  Customize the look and feel of your portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {themeOptions.map((theme) => {
                      const IconComponent = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() =>
                            updateSettings('appearance', 'theme', theme.value)
                          }
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            settings.appearance.theme === theme.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{theme.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-6 gap-3 mt-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          updateSettings(
                            'appearance',
                            'accentColor',
                            color.value
                          )
                        }
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          settings.appearance.accentColor === color.value
                            ? 'border-gray-400'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${color.color} mx-auto mb-1`}
                        ></div>
                        <p className="text-xs">{color.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Layout Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compactMode">Compact Mode</Label>
                        <p className="text-sm text-gray-600">
                          Use a more compact layout to fit more content
                        </p>
                      </div>
                      <Switch
                        id="compactMode"
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(checked) =>
                          updateSettings('appearance', 'compactMode', checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Gamification</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showPoints">Show Points</Label>
                        <p className="text-sm text-gray-600">
                          Display points and achievements
                        </p>
                      </div>
                      <Switch
                        id="showPoints"
                        checked={settings.appearance.showPoints}
                        onCheckedChange={(checked) =>
                          updateSettings('appearance', 'showPoints', checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showStreaks">Show Streaks</Label>
                        <p className="text-sm text-gray-600">
                          Display activity streaks and progress
                        </p>
                      </div>
                      <Switch
                        id="showStreaks"
                        checked={settings.appearance.showStreaks}
                        onCheckedChange={(checked) =>
                          updateSettings('appearance', 'showStreaks', checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Control your privacy settings and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Visibility</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="profileVisibility">
                        Profile Visibility
                      </Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) =>
                          updateSettings('privacy', 'profileVisibility', value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public - Anyone can see your profile
                          </SelectItem>
                          <SelectItem value="friends">
                            Friends Only - Only friends can see your profile
                          </SelectItem>
                          <SelectItem value="private">
                            Private - Only you can see your profile
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activityVisibility">
                        Activity Visibility
                      </Label>
                      <Select
                        value={settings.privacy.activityVisibility}
                        onValueChange={(value) =>
                          updateSettings('privacy', 'activityVisibility', value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public - Anyone can see your activity
                          </SelectItem>
                          <SelectItem value="friends">
                            Friends Only - Only friends can see your activity
                          </SelectItem>
                          <SelectItem value="private">
                            Private - Only you can see your activity
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Data Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dataSharing">Data Sharing</Label>
                        <p className="text-sm text-gray-600">
                          Allow sharing anonymized data to improve the service
                        </p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) =>
                          updateSettings('privacy', 'dataSharing', checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">Analytics</Label>
                        <p className="text-sm text-gray-600">
                          Allow collection of usage analytics
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) =>
                          updateSettings('privacy', 'analytics', checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Privacy Notice
                      </h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Your data is stored locally in your browser and is not
                        transmitted to external servers. You have full control
                        over your information and can export or delete it at any
                        time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your data backups, exports, and storage preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Backup Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Auto Backup</Label>
                        <p className="text-sm text-gray-600">
                          Automatically backup your data
                        </p>
                      </div>
                      <Switch
                        id="autoBackup"
                        checked={settings.data.autoBackup}
                        onCheckedChange={(checked) =>
                          updateSettings('data', 'autoBackup', checked)
                        }
                      />
                    </div>
                    {settings.data.autoBackup && (
                      <div>
                        <Label htmlFor="backupFrequency">
                          Backup Frequency
                        </Label>
                        <Select
                          value={settings.data.backupFrequency}
                          onValueChange={(value) =>
                            updateSettings('data', 'backupFrequency', value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Data Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={exportData}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                        id="import-file"
                      />
                      <Button
                        onClick={() =>
                          document.getElementById('import-file')?.click()
                        }
                        variant="outline"
                        className="flex items-center gap-2 w-full"
                      >
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset All Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all your data including
                            settings, expenses, tasks, habits, and more. This
                            action cannot be undone. Are you sure you want to
                            continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={resetAllData}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reset All Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">
                        Data Storage
                      </h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        All your data is stored locally in your browser's
                        localStorage. Make sure to export your data regularly to
                        prevent loss if you clear your browser data or switch
                        devices.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Trash2, Plus, Save, ArrowLeft } from 'lucide-react';

interface Language {
  name: string;
  level: string;
}

interface Education {
  degree: string;
  institution: string;
  date: string;
  description: string;
}

interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
}

interface Skill {
  category: string;
  items: string[];
}

interface Certification {
  title: string;
  issuer: string;
  date: string;
}

interface Profile {
  _id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  profileImage: string;
  languages: Language[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  locale: string;
  isActive: boolean;
}

export default function ProfileEditor() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<{ en: Profile | null; tr: Profile | null }>({
    en: null,
    tr: null
  });
  const [activeTab, setActiveTab] = useState<'en' | 'tr'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize empty profile
  const getEmptyProfile = (locale: string): Profile => ({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    github: '',
    linkedin: '',
    profileImage: '',
    languages: [],
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    locale,
    isActive: true
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        const enProfile = data.find((p: Profile) => p.locale === 'en');
        const trProfile = data.find((p: Profile) => p.locale === 'tr');
        
        setProfiles({
          en: enProfile || getEmptyProfile('en'),
          tr: trProfile || getEmptyProfile('tr')
        });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Profil bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (locale: 'en' | 'tr', field: string, value: any) => {
    setProfiles(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale]!,
        [field]: value
      }
    }));
  };

  const addArrayItem = (locale: 'en' | 'tr', field: keyof Profile, item: any) => {
    setProfiles(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale]!,
        [field]: [...(prev[locale]![field] as any[]), item]
      }
    }));
  };

  const removeArrayItem = (locale: 'en' | 'tr', field: keyof Profile, index: number) => {
    setProfiles(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale]!,
        [field]: (prev[locale]![field] as any[]).filter((_, i) => i !== index)
      }
    }));
  };

  const updateArrayItem = (locale: 'en' | 'tr', field: keyof Profile, index: number, value: any) => {
    setProfiles(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale]!,
        [field]: (prev[locale]![field] as any[]).map((item, i) => i === index ? value : item)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentProfile = profiles[activeTab];
      if (!currentProfile) return;

      const method = currentProfile._id ? 'PUT' : 'POST';
      const url = currentProfile._id 
        ? `/api/admin/profile/${currentProfile._id}`
        : '/api/admin/profile';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProfile),
      });

      if (response.ok) {
        toast.success('Profil başarıyla kaydedildi');
        fetchProfiles(); // Refresh data
      } else {
        throw new Error('Kayıt başarısız');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Profil kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[activeTab];
  if (!currentProfile) return null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">Profil Düzenle</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'en' | 'tr')}>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="tr">Türkçe</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={currentProfile.name}
                    onChange={(e) => updateProfile(activeTab, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Ünvan</Label>
                  <Input
                    id="title"
                    value={currentProfile.title}
                    onChange={(e) => updateProfile(activeTab, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentProfile.email}
                    onChange={(e) => updateProfile(activeTab, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={currentProfile.phone}
                    onChange={(e) => updateProfile(activeTab, 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Konum</Label>
                  <Input
                    id="location"
                    value={currentProfile.location}
                    onChange={(e) => updateProfile(activeTab, 'location', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="profileImage">Profil Resmi URL</Label>
                  <Input
                    id="profileImage"
                    value={currentProfile.profileImage}
                    onChange={(e) => updateProfile(activeTab, 'profileImage', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={currentProfile.github}
                    onChange={(e) => updateProfile(activeTab, 'github', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={currentProfile.linkedin}
                    onChange={(e) => updateProfile(activeTab, 'linkedin', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea
                  id="bio"
                  value={currentProfile.bio}
                  onChange={(e) => updateProfile(activeTab, 'bio', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Diller
                <Button
                  size="sm"
                  onClick={() => addArrayItem(activeTab, 'languages', { name: '', level: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dil Ekle
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProfile.languages.map((language, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Input
                      placeholder="Dil"
                      value={language.name}
                      onChange={(e) => updateArrayItem(activeTab, 'languages', index, { ...language, name: e.target.value })}
                    />
                    <Select
                      value={language.level}
                      onValueChange={(value) => updateArrayItem(activeTab, 'languages', index, { ...language, level: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Seviye" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Native">Anadil</SelectItem>
                        <SelectItem value="C2">C2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="A1">A1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem(activeTab, 'languages', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Eğitim
                <Button
                  size="sm"
                  onClick={() => addArrayItem(activeTab, 'education', { degree: '', institution: '', date: '', description: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Eğitim Ekle
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentProfile.education.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(activeTab, 'education', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Derece</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateArrayItem(activeTab, 'education', index, { ...edu, degree: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Kurum</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateArrayItem(activeTab, 'education', index, { ...edu, institution: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Tarih</Label>
                        <Input
                          value={edu.date}
                          onChange={(e) => updateArrayItem(activeTab, 'education', index, { ...edu, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => updateArrayItem(activeTab, 'education', index, { ...edu, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Deneyim
                <Button
                  size="sm"
                  onClick={() => addArrayItem(activeTab, 'experience', { title: '', company: '', date: '', description: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deneyim Ekle
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentProfile.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(activeTab, 'experience', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Pozisyon</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateArrayItem(activeTab, 'experience', index, { ...exp, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Şirket</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateArrayItem(activeTab, 'experience', index, { ...exp, company: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Tarih</Label>
                        <Input
                          value={exp.date}
                          onChange={(e) => updateArrayItem(activeTab, 'experience', index, { ...exp, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateArrayItem(activeTab, 'experience', index, { ...exp, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Yetenekler
                <Button
                  size="sm"
                  onClick={() => addArrayItem(activeTab, 'skills', { category: '', items: [] })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Kategori Ekle
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentProfile.skills.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Kategori adı"
                        value={skill.category}
                        onChange={(e) => updateArrayItem(activeTab, 'skills', index, { ...skill, category: e.target.value })}
                        className="flex-1 mr-4"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(activeTab, 'skills', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Yetenekler (virgülle ayırın)</Label>
                      <Textarea
                        value={skill.items.join(', ')}
                        onChange={(e) => updateArrayItem(activeTab, 'skills', index, { 
                          ...skill, 
                          items: e.target.value.split(',').map(item => item.trim()).filter(item => item) 
                        })}
                        placeholder="JavaScript, React, Node.js"
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skill.items.map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sertifikalar
                <Button
                  size="sm"
                  onClick={() => addArrayItem(activeTab, 'certifications', { title: '', issuer: '', date: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Sertifika Ekle
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentProfile.certifications.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(activeTab, 'certifications', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Sertifika Adı</Label>
                        <Input
                          value={cert.title}
                          onChange={(e) => updateArrayItem(activeTab, 'certifications', index, { ...cert, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Veren Kurum</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateArrayItem(activeTab, 'certifications', index, { ...cert, issuer: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Tarih</Label>
                        <Input
                          value={cert.date}
                          onChange={(e) => updateArrayItem(activeTab, 'certifications', index, { ...cert, date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
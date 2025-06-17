'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, User, Globe, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
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

interface Profile {
  _id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  profileImage: string;
  languages: Array<{ name: string; level: string }>;
  education: Array<{ degree: string; institution: string; date: string; description: string }>;
  experience: Array<{ title: string; company: string; date: string; description: string }>;
  skills: Array<{ category: string; items: string[] }>;
  certifications: Array<{ title: string; issuer: string; date: string }>;
  locale: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileManagement() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        throw new Error('Profiller alınamadı');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Profiller yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/profile/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Profil başarıyla silindi');
        fetchProfiles();
      } else {
        throw new Error('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Profil silinirken hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (profile: Profile) => {
    try {
      const response = await fetch(`/api/admin/profile/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          isActive: !profile.isActive,
        }),
      });

      if (response.ok) {
        toast.success(`Profil ${!profile.isActive ? 'aktif' : 'pasif'} edildi`);
        fetchProfiles();
      } else {
        throw new Error('Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Profiller yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profil Yönetimi</h1>
        <Button onClick={() => router.push('/admin/profile/editor')}>
          <Plus className="h-4 w-4 mr-2" />
          Profil Düzenle
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz profil bulunamadı</h3>
            <p className="text-muted-foreground text-center mb-4">
              CV bilgilerinizi eklemek için profil editörünü kullanın.
            </p>
            <Button onClick={() => router.push('/admin/profile/editor')}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Profili Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {profiles.map((profile) => (
            <Card key={profile._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.profileImage} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {profile.name}
                        <Badge variant={profile.locale === 'en' ? 'default' : 'secondary'}>
                          <Globe className="h-3 w-3 mr-1" />
                          {profile.locale.toUpperCase()}
                        </Badge>
                        <Badge variant={profile.isActive ? 'default' : 'secondary'}>
                          {profile.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground">{profile.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={profile.isActive ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleActive(profile)}
                    >
                      {profile.isActive ? 'Pasif Et' : 'Aktif Et'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/admin/profile/editor')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleting === profile._id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting === profile._id ? 'Siliniyor...' : 'Sil'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Profili sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            {profile.name} profilini silmek istediğinizden emin misiniz? 
                            Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(profile._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {profile.bio}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{profile.languages.length}</div>
                    <div className="text-xs text-muted-foreground">Dil</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{profile.education.length}</div>
                    <div className="text-xs text-muted-foreground">Eğitim</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{profile.experience.length}</div>
                    <div className="text-xs text-muted-foreground">Deneyim</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{profile.skills.length}</div>
                    <div className="text-xs text-muted-foreground">Yetenek Kategorisi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{profile.certifications.length}</div>
                    <div className="text-xs text-muted-foreground">Sertifika</div>
                  </div>
                </div>

                {/* Languages */}
                {profile.languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Diller</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang.name} ({lang.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Preview */}
                {profile.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Yetenekler</h4>
                    <div className="space-y-2">
                      {profile.skills.slice(0, 2).map((skill, index) => (
                        <div key={index}>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            {skill.category}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skill.items.slice(0, 5).map((item, itemIndex) => (
                              <Badge key={itemIndex} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                            {skill.items.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{skill.items.length - 5} daha
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {profile.skills.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{profile.skills.length - 2} kategori daha
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Son güncelleme: {new Date(profile.updatedAt).toLocaleDateString('tr-TR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
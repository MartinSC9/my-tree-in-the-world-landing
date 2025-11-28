import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@shared/components/ui/dialog';
import { Textarea } from '@shared/components/ui/textarea';
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Loader2,
  User,
  Mail,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';
import profileService from '@/modules/admin/services/profileService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminProfileApprovalsContent() {
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPendingProfiles();
  }, []);

  const loadPendingProfiles = async () => {
    try {
      setLoading(true);
      const data = await profileService.getPendingApprovals();
      setPendingProfiles(data);
    } catch (error) {
      console.error('Error cargando perfiles pendientes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los perfiles pendientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profile) => {
    if (!window.confirm(`¿Aprobar el perfil de ${profile.username || profile.email} como ${profile.role}?`)) {
      return;
    }

    try {
      setProcessingId(profile.id);
      await profileService.approveProfile(profile.id);
      await loadPendingProfiles();
      toast({
        title: "Perfil aprobado",
        description: `El perfil de ${profile.username || profile.email} ha sido aprobado exitosamente`,
      });
    } catch (error) {
      console.error('Error aprobando perfil:', error);
      toast({
        title: "Error",
        description: "No se pudo aprobar el perfil",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (profile) => {
    setSelectedProfile(profile);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una razón para el rechazo",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingId(selectedProfile.id);
      await profileService.rejectProfile(selectedProfile.id, rejectionReason);
      setRejectDialogOpen(false);
      await loadPendingProfiles();
      toast({
        title: "Perfil rechazado",
        description: `El perfil de ${selectedProfile.username || selectedProfile.email} ha sido rechazado`,
      });
    } catch (error) {
      console.error('Error rechazando perfil:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar el perfil",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
      setSelectedProfile(null);
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      vivero: 'Vivero',
      plantador: 'Plantador'
    };
    return roleMap[role] || role;
  };

  const getRoleIcon = (role) => {
    return role === 'vivero' ? Building2 : User;
  };

  const getRoleColor = (role) => {
    return role === 'vivero' ? 'text-green-600' : 'text-blue-600';
  };

  const stats = {
    pending: pendingProfiles.length,
    approved: 0, // TODO: Obtener del backend
    rejected: 0  // TODO: Obtener del backend
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando perfiles pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
          <UserCheck className="h-8 w-8" />
          Aprobación de Perfiles
        </h1>
        <p className="text-gray-600 mt-2">
          Revisa y aprueba solicitudes de viveros y plantadores para unirse a la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes de Revisión
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
            <p className="text-xs text-orange-600 mt-1 font-semibold">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aprobados
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.approved}</div>
            <p className="text-xs text-green-600 mt-1 font-semibold">
              Activos en la plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rechazados
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.rejected}</div>
            <p className="text-xs text-red-600 mt-1 font-semibold">
              No cumplieron requisitos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Profiles List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Perfiles Pendientes</CardTitle>
          <CardDescription>
            Revisa la información de cada perfil antes de aprobar o rechazar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingProfiles.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                ¡Todo al día!
              </p>
              <p className="text-gray-600">
                No hay perfiles pendientes de aprobación en este momento
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProfiles.map((profile) => {
                const RoleIcon = getRoleIcon(profile.role);
                const roleColor = getRoleColor(profile.role);

                return (
                  <Card key={profile.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full bg-white shadow-sm ${roleColor}`}>
                            <RoleIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {profile.username || profile.email}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <span className="font-semibold">{getRoleDisplay(profile.role)}</span>
                              {profile.business_name && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{profile.business_name}</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(profile)}
                            disabled={processingId === profile.id}
                          >
                            {processingId === profile.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => openRejectDialog(profile)}
                            disabled={processingId === profile.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{profile.email}</p>
                          </div>
                        </div>

                        {profile.document_number && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">
                                {profile.document_type_code || 'Documento'}
                              </p>
                              <p className="text-sm font-medium">{profile.document_number}</p>
                            </div>
                          </div>
                        )}

                        {profile.tax_id && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">CUIT/Tax ID</p>
                              <p className="text-sm font-medium">{profile.tax_id}</p>
                            </div>
                          </div>
                        )}

                        {profile.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Ubicación</p>
                              <p className="text-sm font-medium">{profile.location}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha de Solicitud</p>
                            <p className="text-sm font-medium">
                              {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>

                        {profile.first_name && (
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Nombre Completo</p>
                              <p className="text-sm font-medium">
                                {profile.first_name} {profile.last_name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {profile.bio && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Biografía / Descripción</p>
                          <p className="text-sm text-gray-700">{profile.bio}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-800">Rechazar Perfil</DialogTitle>
            <DialogDescription>
              Proporciona una razón clara para el rechazo. Esta información será enviada al usuario.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedProfile && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold">
                  {selectedProfile.username || selectedProfile.email}
                </p>
                <p className="text-xs text-gray-600">
                  {getRoleDisplay(selectedProfile.role)} • {selectedProfile.email}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Razón del rechazo *
              </label>
              <Textarea
                placeholder="Ej: Documentación incompleta, información no verificable, no cumple requisitos de experiencia..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={processingId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processingId !== null}
            >
              {processingId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rechazando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar Perfil
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

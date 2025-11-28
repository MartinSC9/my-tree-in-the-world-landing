import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { useToast } from '@shared/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import {
  AlertTriangle,
  CheckCircle,
  EyeOff,
  XCircle,
  ExternalLink,
  Flag,
  Loader2,
  RefreshCw,
  Shield
} from 'lucide-react';
import moderationService from '@/modules/admin/services/moderationService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminModerationContent = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('flagged'); // 'all', 'flagged', 'hidden'
  const [processingId, setProcessingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = [...posts];

    if (filter === 'flagged') {
      filtered = filtered.filter(post => post.is_flagged && !post.is_hidden);
    } else if (filter === 'hidden') {
      filtered = filtered.filter(post => post.is_hidden);
    }

    setFilteredPosts(filtered);
  }, [posts, filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Cargar todos los posts para tener flexibilidad de filtrado
      const data = await moderationService.getAllPosts({});
      setPosts(data);
    } catch (error) {
      console.error('Error cargando posts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHidePost = async (postId) => {
    if (!window.confirm('¿Estás seguro de ocultar este post? Esta acción puede revertirse.')) {
      return;
    }

    try {
      setProcessingId(postId);
      await moderationService.hidePost(postId);
      await loadPosts();
      toast({
        title: "Éxito",
        description: "Post ocultado correctamente",
      });
    } catch (error) {
      console.error('Error ocultando post:', error);
      toast({
        title: "Error",
        description: "No se pudo ocultar el post",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDismissReport = async (postId) => {
    if (!window.confirm('¿Descartar este reporte? El post permanecerá visible.')) {
      return;
    }

    try {
      setProcessingId(postId);
      await moderationService.unflagPost(postId);
      await loadPosts();
      toast({
        title: "Éxito",
        description: "Reporte descartado correctamente",
      });
    } catch (error) {
      console.error('Error descartando reporte:', error);
      toast({
        title: "Error",
        description: "No se pudo descartar el reporte",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Calcular estadísticas
  const totalPosts = posts.length;
  const flaggedPosts = posts.filter(p => p.is_flagged && !p.is_hidden).length;
  const hiddenPosts = posts.filter(p => p.is_hidden).length;
  const resolvedPosts = posts.filter(p => p.is_flagged && p.is_hidden).length;

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts.toLocaleString(),
      icon: Shield,
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Posts Reportados',
      value: flaggedPosts.toLocaleString(),
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Posts Ocultos',
      value: hiddenPosts.toLocaleString(),
      icon: EyeOff,
      gradient: 'from-red-600 to-red-500'
    },
    {
      title: 'Reportes Resueltos',
      value: resolvedPosts.toLocaleString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Moderación de Contenido
          </h1>
          <p className="text-gray-600 mt-2">
            Revisar y gestionar posts reportados por la comunidad
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadPosts}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Recargar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-red-800">Posts para Moderación</CardTitle>
              <CardDescription>Gestionar contenido reportado o inapropiado</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los posts</SelectItem>
                <SelectItem value="flagged">Posts reportados</SelectItem>
                <SelectItem value="hidden">Posts ocultos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'flagged'
                ? 'No hay reportes pendientes'
                : filter === 'hidden'
                ? 'No hay posts ocultos'
                : 'No hay posts'}
            </h3>
            <p className="text-gray-500">
              {filter === 'flagged'
                ? 'Todos los contenidos reportados han sido revisados'
                : 'No hay contenido en esta categoría'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card
              key={post.id}
              className={`border-2 ${
                post.is_flagged && !post.is_hidden
                  ? 'border-orange-300 bg-orange-50'
                  : post.is_hidden
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Usuario #{post.user_id}</CardTitle>
                      {post.is_flagged && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Flag className="h-3 w-3" />
                          Reportado
                        </span>
                      )}
                      {post.is_hidden && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Publicado {formatDistanceToNow(new Date(post.created_at), { locale: es, addSuffix: true })}
                      {post.flagged_at && (
                        <> • Reportado {formatDistanceToNow(new Date(post.flagged_at), { locale: es, addSuffix: true })}</>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Post Content */}
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image_url && (
                    <div className="bg-white p-2 rounded-lg border">
                      <img
                        src={post.image_url}
                        alt="Contenido del post"
                        className="rounded-lg max-h-96 mx-auto object-contain"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.is_flagged && !post.is_hidden && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleHidePost(post.id)}
                          disabled={processingId === post.id}
                          className="flex items-center gap-2"
                        >
                          {processingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          Ocultar Post
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDismissReport(post.id)}
                          disabled={processingId === post.id}
                          className="flex items-center gap-2"
                        >
                          {processingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Descartar Reporte
                        </Button>
                      </>
                    )}

                    {post.is_hidden && (
                      <div className="text-sm text-gray-600">
                        Este post está oculto y no es visible para los usuarios
                      </div>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver Perfil
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 pt-2 border-t space-y-1">
                    <p>Post ID: {post.id}</p>
                    <p>Usuario ID: {post.user_id}</p>
                    {post.hidden_by && <p>Oculto por Admin #{post.hidden_by}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Guía de Moderación</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <p><strong>Ocultar Post:</strong> El post ya no será visible para otros usuarios. Usa esto para contenido inapropiado, spam o que viole las políticas.</p>
          <p><strong>Descartar Reporte:</strong> El reporte se marca como revisado pero el post permanece visible. Usa esto cuando el contenido es apropiado.</p>
          <p><strong>Criterios de moderación:</strong> Contenido ofensivo, spam, información falsa, imágenes inapropiadas, acoso o cualquier violación de términos de servicio.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModerationContent;

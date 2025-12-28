import React, { useState } from 'react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Label } from '@shared/components/ui/label';
import { Mail, Phone, MapPin, Send, Building2 } from 'lucide-react';
import { useToast } from '@shared/components/ui/use-toast';
import { Link } from 'react-router-dom';
import Footer from '@shared/components/layout/Footer';

const ContactoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    empresa: '',
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    tipoConsulta: 'corporativo'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    
    setFormData({
      empresa: '',
      nombre: '',
      email: '',
      telefono: '',
      mensaje: '',
      tipoConsulta: 'corporativo'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contacto Corporativo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ¿Tu empresa quiere ser parte del cambio? Contáctanos para conocer nuestras soluciones de compensación de carbono y reforestación corporativa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-green-600" />
                Solicitar Información
              </CardTitle>
              <CardDescription>
                Completa el formulario y nos pondremos en contacto contigo para diseñar una solución personalizada para tu empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa *</Label>
                    <Input
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      placeholder="Nombre de tu empresa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email corporativo *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@empresa.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoConsulta">Tipo de consulta</Label>
                  <select
                    id="tipoConsulta"
                    name="tipoConsulta"
                    value={formData.tipoConsulta}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="corporativo">Compensación de carbono corporativa</option>
                    <option value="reforestación">Proyectos de reforestación</option>
                    <option value="certificacion">Certificación ambiental</option>
                    <option value="partnership">Partnership empresarial</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje *</Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre tu empresa y qué tipo de solución ambiental estás buscando..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar consulta
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-xl dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
                <CardDescription>
                  También puedes contactarnos directamente a través de estos medios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@miarbolenelmundo.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">Teléfono</h3>
                    <p className="text-gray-600 dark:text-gray-400">+54 11 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">Oficina</h3>
                    <p className="text-gray-600 dark:text-gray-400">Córdoba, Argentina</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-green-50 dark:bg-green-900/20 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-green-800 dark:text-green-400">¿Por qué elegir nuestras soluciones?</h3>
                <ul className="space-y-3 text-green-700 dark:text-green-400">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Compensación verificada de huella de carbono</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Proyectos de reforestación con impacto real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Certificaciones ambientales reconocidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reportes de impacto detallados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactoPage;
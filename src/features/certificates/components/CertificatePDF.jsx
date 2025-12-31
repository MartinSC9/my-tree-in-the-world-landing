import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  border: {
    border: '8px solid #059669',
    borderRadius: 12,
    padding: 25,
    height: '100%',
  },
  innerBorder: {
    border: '3px solid #10b981',
    borderRadius: 10,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    color: '#059669',
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  divider: {
    width: 100,
    height: 3,
    backgroundColor: '#10b981',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 6,
    marginBottom: 8,
  },
  body: {
    marginTop: 10,
    marginBottom: 20,
  },
  certificationText: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 1.5,
  },
  userName: {
    fontSize: 20,
    color: '#065f46',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    border: '3px solid #bbf7d0',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  infoItem: {
    width: '48%',
  },
  infoLabel: {
    fontSize: 8,
    color: '#059669',
    marginBottom: 2,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 10,
    color: '#065f46',
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  impactBox: {
    backgroundColor: '#059669',
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
  },
  impactTitle: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  impactItem: {
    alignItems: 'center',
    width: '30%',
  },
  impactValue: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  impactLabel: {
    fontSize: 7,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: '2px solid #d1d5db',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  certificateId: {
    fontSize: 10,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  organizationInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  organizationText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: 'bold',
  },
  organizationSubtext: {
    fontSize: 8,
    color: '#059669',
    textAlign: 'center',
    marginTop: 2,
  },
});

const CertificatePDF = ({ tree, treeOwner }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Valores por defecto si no existen
  const treeName = tree?.name || 'Árbol';
  const treeCountry = tree?.country || 'Ubicación no especificada';
  const treePlantedAt = tree?.planted_at || new Date().toISOString();
  const treeId = tree?.id || 0;
  const ownerName =
    treeOwner?.first_name || treeOwner?.last_name
      ? `${treeOwner.first_name || ''} ${treeOwner.last_name || ''}`.trim()
      : 'Un usuario';

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            {/* Header */}
            <View>
              <View style={styles.header}>
                <Text style={styles.subtitle}>CERTIFICADO OFICIAL DE</Text>
                <Text style={styles.title}>PLANTACIÓN DE ÁRBOL</Text>
                <View style={styles.divider} />
              </View>

              {/* Body */}
              <View style={styles.body}>
                <Text style={styles.certificationText}>Por la presente se certifica que</Text>

                <Text style={styles.userName}>{ownerName}</Text>

                <Text style={styles.certificationText}>
                  ha contribuido exitosamente a la conservación del medio ambiente mediante{'\n'}
                  la plantación de un árbol que apoya la reforestación y la lucha contra el cambio
                  climático.
                </Text>

                {/* Información del Árbol */}
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>NOMBRE DEL ÁRBOL</Text>
                      <Text style={styles.infoValue}>{treeName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>UBICACIÓN</Text>
                      <Text style={styles.infoValue}>{treeCountry}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRowLast}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>FECHA DE PLANTACIÓN</Text>
                      <Text style={styles.infoValue}>{formatDate(treePlantedAt)}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>CONTRIBUCIÓN</Text>
                      <Text style={styles.infoValue}>$12.000 COP</Text>
                    </View>
                  </View>
                </View>

                {/* Impacto Ambiental */}
                <View style={styles.impactBox}>
                  <Text style={styles.impactTitle}>IMPACTO AMBIENTAL ANUAL</Text>
                  <View style={styles.impactRow}>
                    <View style={styles.impactItem}>
                      <Text style={styles.impactValue}>22 kg</Text>
                      <Text style={styles.impactLabel}>CO₂ Absorbido</Text>
                    </View>
                    <View style={styles.impactItem}>
                      <Text style={styles.impactValue}>730 L</Text>
                      <Text style={styles.impactLabel}>Oxígeno Producido (diario)</Text>
                    </View>
                    <View style={styles.impactItem}>
                      <Text style={styles.impactValue}>100%</Text>
                      <Text style={styles.impactLabel}>Compromiso Ambiental</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.certificateId}>
                Certificado ID: {treeId.toString().padStart(6, '0')}
              </Text>
              <View style={styles.organizationInfo}>
                <View>
                  <Text style={styles.organizationText}>Mi Árbol en el Mundo</Text>
                  <Text style={styles.organizationSubtext}>Certificado Digital de Plantación</Text>
                  <Text style={styles.footerText}>
                    {formatDate(new Date())} • www.miarbolelmundo.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePDF;

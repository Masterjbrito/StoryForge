import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Layers,
  Boxes,
  FileText,
  CheckSquare,
  FlaskConical,
  Download,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle2,
  Shield,
  Building2,
  Copy,
  MoreVertical,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { useAgent } from '@/contexts/AgentContext';
import { useAudit } from '@/contexts/AuditContext';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface ProjectViewProps {
  onNavigate?: (view: View) => void;
  projectId?: number | null;
}

// Dados completos do projeto (em produÃ§Ã£o viria de API)
const projectsData: Record<number, any> = {
  999: {
    id: 999,
    name: 'Sistema de Pagamentos MB Way',
    code: 'MBWAY-NEW-2024',
    department: 'Digital Payments',
    type: 'Mobile Banking',
    platform: 'Jira Cloud',
    version: 'v1.0.0',
    createdAt: new Date(),
    lastExport: new Date(),
    createdBy: 'Susana Gamito',
    description: 'Sistema completo de pagamentos mÃ³veis MB Way gerado pelo IA Assistant com rigor bancÃ¡rio, incluindo transferÃªncias instantÃ¢neas, autenticaÃ§Ã£o PSD2 e compliance total.',
    objectives: [
      'Implementar transferÃªncias instantÃ¢neas P2P via nÃºmero de telemÃ³vel',
      'Integrar com rede SIBS para processamento de pagamentos',
      'Garantir conformidade total com PSD2 e autenticaÃ§Ã£o forte (SCA)',
      'Criar experiÃªncia mobile nativa iOS e Android',
      'Implementar sistema de limites configurÃ¡veis por perfil'
    ],
    compliance: ['PSD2', 'GDPR', 'SIBS', 'SCA'],
    qualityScore: 98,
    url: 'https://company.atlassian.net/browse/MBWAY-NEW',
    
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'SeguranÃ§a BancÃ¡ria',
        description: 'ImplementaÃ§Ã£o completa de seguranÃ§a bancÃ¡ria com PSD2 e SCA',
        businessValue: 'Garantir conformidade com regulaÃ§Ã£o PSD2 e proteger transaÃ§Ãµes financeiras',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: [
          'AutenticaÃ§Ã£o forte (SCA) obrigatÃ³ria para transaÃ§Ãµes > 30â‚¬',
          'Biometria validada conforme normas do Banco de Portugal',
          'Logs de auditoria mantidos por 10 anos (requisito legal)'
        ],
        expanded: true,
        
        features: [
          {
            id: 'FT-001',
            type: 'feature',
            title: 'AutenticaÃ§Ã£o PSD2',
            description: 'Strong Customer Authentication conforme PSD2',
            priority: 'High',
            status: 'Exportado',
            acceptanceCriteria: [
              'Implementar 2FA com biometria + PIN',
              'Validar com SIBS e Banco de Portugal',
              'Logs de auditoria completos'
            ],
            labels: ['Security', 'PSD2', 'Compliance'],
            expanded: true,
            
            userStories: [
              {
                id: 'US-001',
                type: 'userStory',
                title: 'Login com Biometria',
                asA: 'cliente bancÃ¡rio',
                iWant: 'fazer login usando biometria',
                soThat: 'possa aceder Ã  aplicaÃ§Ã£o de forma rÃ¡pida e segura',
                acceptanceCriteria: [
                  'Sistema deve suportar Touch ID e Face ID',
                  'Fallback para PIN em caso de falha',
                  'MÃ¡ximo de 3 tentativas antes de bloqueio'
                ],
                priority: 'High',
                storyPoints: 5,
                status: 'Exportado',
                labels: ['Biometria', 'Security'],
                expanded: false,
                tasks: [],
                testCases: []
              }
            ]
          }
        ]
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'GestÃ£o de Pagamentos',
        description: 'Sistema completo de transferÃªncias e pagamentos',
        businessValue: 'Permitir transferÃªncias instantÃ¢neas P2P',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: [
          'TransferÃªncias instantÃ¢neas via SIBS',
          'Limites configurÃ¡veis por perfil',
          'NotificaÃ§Ãµes em tempo real'
        ],
        expanded: false,
        features: []
      },
      {
        id: 'EP-003',
        type: 'epic',
        title: 'ExperiÃªncia de Utilizador',
        description: 'Interface mobile nativa iOS e Android',
        businessValue: 'Melhorar usabilidade e satisfaÃ§Ã£o do cliente',
        priority: 'Medium',
        status: 'Exportado',
        acceptanceCriteria: [
          'Design responsivo e acessÃ­vel',
          'Performance < 2s por operaÃ§Ã£o',
          'Suporte offline bÃ¡sico'
        ],
        expanded: false,
        features: []
      }
    ]
  },
  1: {
    id: 1,
    name: 'Sistema de Pagamentos MB Way',
    code: 'MBWAY-2024',
    department: 'Digital Payments',
    type: 'Mobile Banking',
    platform: 'Jira Cloud',
    version: 'v2.1.0',
    createdAt: new Date('2025-12-15'),
    lastExport: new Date('2026-01-08T14:30:00'),
    createdBy: 'Susana Gamito',
    description: 'Sistema completo de pagamentos mÃ³veis MB Way para particulares e empresas, incluindo transferÃªncias instantÃ¢neas, pagamentos em comerciantes, levantamentos ATM e gestÃ£o de limites.',
    objectives: [
      'Implementar transferÃªncias instantÃ¢neas P2P via nÃºmero de telemÃ³vel',
      'Integrar com rede SIBS para processamento de pagamentos',
      'Garantir conformidade total com PSD2 e autenticaÃ§Ã£o forte (SCA)',
      'Criar experiÃªncia mobile nativa iOS e Android',
      'Implementar sistema de limites configurÃ¡veis por perfil'
    ],
    compliance: ['PSD2', 'GDPR', 'SIBS', 'SCA'],
    qualityScore: 98,
    url: 'https://company.atlassian.net/browse/MBWAY',
    
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'AutenticaÃ§Ã£o e SeguranÃ§a BancÃ¡ria',
        description: 'ImplementaÃ§Ã£o completa de autenticaÃ§Ã£o forte com mÃºltiplos fatores conforme PSD2 e Banco de Portugal',
        businessValue: 'Garantir conformidade com regulaÃ§Ã£o PSD2, proteger transaÃ§Ãµes financeiras e prevenir fraude',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: [
          'AutenticaÃ§Ã£o forte (SCA) obrigatÃ³ria para transaÃ§Ãµes > 30â‚¬',
          'Biometria validada conforme normas do Banco de Portugal',
          'Logs de auditoria mantidos por 10 anos (requisito legal)',
          'Alertas de fraude em tempo real via SIBS',
          'Conformidade com GDPR na retenÃ§Ã£o de dados biomÃ©tricos'
        ],
        expanded: true,
        
        features: [
          {
            id: 'FT-001',
            type: 'feature',
            title: 'AutenticaÃ§Ã£o PSD2 Compliant',
            description: 'Sistema de autenticaÃ§Ã£o forte com biometria, PIN e OTP conforme diretiva PSD2',
            priority: 'High',
            status: 'Exportado',
            businessRules: [
              'SCA obrigatÃ³rio para todas as transaÃ§Ãµes acima de 30â‚¬',
              'Biometria como fator "algo que sou"',
              'Dispositivo registado como fator "algo que tenho"',
              'PIN/Password como fator "algo que sei"'
            ],
            expanded: true,
            
            userStories: [
              {
                id: 'US-001',
                type: 'userStory',
                title: 'Login com Biometria Facial/Digital',
                asA: 'cliente bancÃ¡rio particular',
                iWant: 'fazer login usando biometria (impressÃ£o digital ou reconhecimento facial)',
                soThat: 'possa aceder de forma rÃ¡pida e segura Ã  minha conta sem memorizar passwords complexas',
                acceptanceCriteria: [
                  'Suportar Touch ID e Face ID em iOS 14+',
                  'Suportar impressÃ£o digital e reconhecimento facial em Android 10+',
                  'Fallback automÃ¡tico para PIN de 6 dÃ­gitos se biometria indisponÃ­vel',
                  'MÃ¡ximo 3 tentativas falhadas, depois bloqueia e requer desbloqueio por SMS OTP',
                  'Tempo de autenticaÃ§Ã£o < 2 segundos em 95% dos casos',
                  'ValidaÃ§Ã£o de vivacidade (liveness detection) para prevenir spoofing',
                  'EncriptaÃ§Ã£o de template biomÃ©trico no Secure Enclave/TEE'
                ],
                priority: 'High',
                storyPoints: 13,
                status: 'Exportado',
                labels: ['Security', 'UX', 'PSD2', 'Mobile'],
                expanded: true,
                
                tasks: [
                  { 
                    id: 'TSK-001', 
                    title: 'Implementar LocalAuthentication Framework iOS',
                    description: 'Integrar framework nativo iOS para Touch ID e Face ID com validaÃ§Ã£o de vivacidade e fallback automÃ¡tico',
                    estimate: '8h',
                    assignee: 'Developer iOS',
                    status: 'Exportado',
                    technicalNotes: 'Usar LAContext com biometria e fallback para deviceOwnerAuthenticationWithBiometrics'
                  },
                  { 
                    id: 'TSK-002', 
                    title: 'Implementar BiometricPrompt Android',
                    description: 'Usar API BiometricPrompt do Android com BiometricManager para validaÃ§Ã£o e gestÃ£o de estados',
                    estimate: '8h',
                    assignee: 'Developer Android',
                    status: 'Exportado',
                    technicalNotes: 'Configurar BIOMETRIC_STRONG com CryptoObject para mÃ¡xima seguranÃ§a'
                  },
                  { 
                    id: 'TSK-003', 
                    title: 'Criar API de validaÃ§Ã£o biomÃ©trica backend',
                    description: 'Endpoint para validar token biomÃ©trico gerado pelo dispositivo contra HSM do banco',
                    estimate: '6h',
                    assignee: 'Backend Developer',
                    status: 'Exportado',
                    technicalNotes: 'Integrar com HSM Thales para validaÃ§Ã£o de assinatura digital'
                  },
                  { 
                    id: 'TSK-004', 
                    title: 'Implementar sistema de fallback para PIN',
                    description: 'Fluxo alternativo com PIN de 6 dÃ­gitos cifrado quando biometria nÃ£o disponÃ­vel',
                    estimate: '4h',
                    assignee: 'Frontend Developer',
                    status: 'Exportado'
                  },
                  { 
                    id: 'TSK-005', 
                    title: 'Sistema de bloqueio e desbloqueio',
                    description: 'Contador de tentativas falhadas com bloqueio temporÃ¡rio (15min) e desbloqueio via SMS OTP',
                    estimate: '5h',
                    assignee: 'Backend Developer',
                    status: 'Exportado'
                  },
                  { 
                    id: 'TSK-006', 
                    title: 'Logs de auditoria para Banco de Portugal',
                    description: 'Registar todas as tentativas de autenticaÃ§Ã£o (sucesso e falha) conforme requisitos legais',
                    estimate: '4h',
                    assignee: 'Backend Developer',
                    status: 'Exportado',
                    technicalNotes: 'Armazenar em BD imutÃ¡vel (append-only) com retenÃ§Ã£o de 10 anos'
                  },
                  { 
                    id: 'TSK-007', 
                    title: 'ProteÃ§Ã£o anti-spoofing (liveness detection)',
                    description: 'Implementar validaÃ§Ã£o de vivacidade para prevenir ataques com fotos/vÃ­deos',
                    estimate: '8h',
                    assignee: 'Developer Mobile',
                    status: 'Exportado',
                    technicalNotes: 'Usar native liveness check do OS quando disponÃ­vel'
                  }
                ],
                
                testCases: [
                  { 
                    id: 'TC-001', 
                    type: 'Functional',
                    priority: 'High',
                    title: 'Validar login biomÃ©trico bem-sucedido',
                    preconditions: [
                      'Utilizador tem conta ativa',
                      'Dispositivo tem biometria configurada',
                      'App instalada e permissÃµes concedidas'
                    ],
                    steps: [
                      'Abrir app MB Way',
                      'Sistema detecta biometria disponÃ­vel',
                      'Sistema solicita autenticaÃ§Ã£o biomÃ©trica',
                      'Utilizador coloca dedo vÃ¡lido/apresenta face',
                      'Sistema valida localmente',
                      'Sistema envia token para backend',
                      'Backend valida com HSM',
                      'Sistema cria sessÃ£o',
                      'Redireciona para dashboard'
                    ],
                    expectedResult: 'Login completo em < 2s, sessÃ£o criada com token JWT vÃ¡lido, dashboard apresentado com saldo atualizado',
                    testData: 'User: test.user@bcp.pt, Device: iPhone 13 com Face ID configurado'
                  },
                  { 
                    id: 'TC-002', 
                    type: 'Functional',
                    priority: 'High',
                    title: 'Testar fallback quando biometria nÃ£o configurada',
                    preconditions: [
                      'Utilizador tem conta ativa',
                      'Dispositivo SEM biometria configurada'
                    ],
                    steps: [
                      'Abrir app',
                      'Sistema deteta ausÃªncia de biometria',
                      'Sistema apresenta ecrÃ£ de PIN automaticamente'
                    ],
                    expectedResult: 'App apresenta teclado numÃ©rico para PIN de 6 dÃ­gitos sem mensagem de erro',
                    testData: 'Device: Android emulator sem biometria'
                  },
                  { 
                    id: 'TC-003', 
                    type: 'Security',
                    priority: 'Critical',
                    title: 'Validar bloqueio apÃ³s 3 tentativas falhadas',
                    preconditions: [
                      'Utilizador tem conta ativa',
                      'Contador de tentativas a zero'
                    ],
                    steps: [
                      'Tentar autenticaÃ§Ã£o com biometria invÃ¡lida (dedo errado)',
                      'Sistema conta tentativa 1',
                      'Repetir com biometria invÃ¡lida',
                      'Sistema conta tentativa 2',
                      'Repetir terceira vez com biometria invÃ¡lida',
                      'Sistema conta tentativa 3 e aciona bloqueio'
                    ],
                    expectedResult: 'Conta bloqueada temporariamente (15min), SMS OTP enviado para nÃºmero registado, log de seguranÃ§a criado com timestamp e device ID, mensagem clara ao utilizador',
                    testData: 'User com telemÃ³vel +351 912 345 678'
                  },
                  { 
                    id: 'TC-004', 
                    type: 'Security',
                    priority: 'Critical',
                    title: 'Testar proteÃ§Ã£o anti-spoofing',
                    preconditions: [
                      'Dispositivo com cÃ¢mara funcional',
                      'Face ID configurado'
                    ],
                    steps: [
                      'Tentar autenticar com fotografia impressa do rosto',
                      'Sistema executa liveness detection',
                      'Sistema deteta ausÃªncia de vivacidade',
                      'Rejeitar autenticaÃ§Ã£o',
                      'Tentar com vÃ­deo do rosto',
                      'Sistema deteta 2D em vez de 3D',
                      'Rejeitar autenticaÃ§Ã£o'
                    ],
                    expectedResult: 'Ambas as tentativas rejeitadas, alerta de seguranÃ§a enviado por email, tentativas registadas em log de auditoria com flag "spoofing_attempt"',
                    testData: 'Foto impressa e vÃ­deo gravado previamente'
                  },
                  { 
                    id: 'TC-005', 
                    type: 'Compliance',
                    priority: 'High',
                    title: 'Validar conformidade PSD2 completa',
                    preconditions: [
                      'Sistema em ambiente de staging',
                      'Acesso a logs de auditoria'
                    ],
                    steps: [
                      'Executar fluxo de autenticaÃ§Ã£o completo',
                      'Validar presenÃ§a dos 3 elementos SCA:',
                      '  - Algo que sei: PIN/Password âœ“',
                      '  - Algo que tenho: Dispositivo registado âœ“',
                      '  - Algo que sou: Biometria âœ“',
                      'Verificar logs contÃªm todos os dados obrigatÃ³rios',
                      'Verificar timestamps em formato ISO 8601',
                      'Verificar encriptaÃ§Ã£o de dados sensÃ­veis',
                      'Validar retenÃ§Ã£o configurada para 10 anos'
                    ],
                    expectedResult: 'Todos os 3 elementos SCA presentes e validados, logs completos com: user_id, device_id, biometric_type, timestamp, ip_address, geolocation, result. Dados encriptados em repouso (AES-256). PolÃ­tica de retenÃ§Ã£o ativa.',
                    testData: 'Credenciais de teste staging'
                  },
                  { 
                    id: 'TC-006', 
                    type: 'Performance',
                    priority: 'Medium',
                    title: 'Validar performance de autenticaÃ§Ã£o',
                    preconditions: [
                      'Rede 4G estÃ¡vel (50 Mbps)',
                      'Backend em produÃ§Ã£o'
                    ],
                    steps: [
                      'Executar 100 autenticaÃ§Ãµes biomÃ©tricas sequenciais',
                      'Medir tempo de cada transaÃ§Ã£o completa (touch -> dashboard)',
                      'Calcular percentil 95',
                      'Identificar outliers > 3s'
                    ],
                    expectedResult: 'P95 < 2 segundos, P99 < 3 segundos, 0 timeouts, 0 erros de rede',
                    testData: 'Script de automaÃ§Ã£o com 100 iteraÃ§Ãµes'
                  }
                ]
              },
              {
                id: 'US-002',
                type: 'userStory',
                title: 'OTP via SMS para AutenticaÃ§Ã£o Forte',
                asA: 'cliente bancÃ¡rio',
                iWant: 'receber cÃ³digo OTP por SMS para transaÃ§Ãµes sensÃ­veis',
                soThat: 'tenha a certeza absoluta que sou eu a autorizar operaÃ§Ãµes importantes',
                acceptanceCriteria: [
                  'OTP de 6 dÃ­gitos numÃ©ricos aleatÃ³rios',
                  'VÃ¡lido por 3 minutos apÃ³s envio',
                  'Enviado via gateway SIBS homologado',
                  'Possibilidade de reenviar apÃ³s 60 segundos',
                  'MÃ¡ximo 3 cÃ³digos vÃ¡lidos em simultÃ¢neo (rolling window)',
                  'ObrigatÃ³rio para transaÃ§Ãµes > 50â‚¬ ou alteraÃ§Ãµes de dados sensÃ­veis',
                  'SMS contÃ©m: cÃ³digo, validade, nome do banco, aviso anti-phishing'
                ],
                priority: 'High',
                storyPoints: 8,
                status: 'Exportado',
                labels: ['Security', 'PSD2', 'SMS'],
                expanded: false,
                
                tasks: [
                  { 
                    id: 'TSK-008', 
                    title: 'Integrar com gateway SMS SIBS',
                    description: 'Implementar comunicaÃ§Ã£o com API SIBS para envio de SMS com retry e failover',
                    estimate: '8h',
                    assignee: 'Backend Developer',
                    status: 'Exportado'
                  },
                  { 
                    id: 'TSK-009', 
                    title: 'Algoritmo de geraÃ§Ã£o OTP (TOTP)',
                    description: 'Implementar Time-based OTP com validaÃ§Ã£o de janela temporal de 3 minutos',
                    estimate: '5h',
                    assignee: 'Backend Developer',
                    status: 'Exportado',
                    technicalNotes: 'Usar RFC 6238 (TOTP) com HMAC-SHA256'
                  },
                  { 
                    id: 'TSK-010', 
                    title: 'UI de inserÃ§Ã£o de cÃ³digo OTP',
                    description: 'Interface com 6 campos individuais + timer visual + opÃ§Ã£o de reenvio',
                    estimate: '6h',
                    assignee: 'Frontend Developer',
                    status: 'Exportado'
                  },
                  { 
                    id: 'TSK-011', 
                    title: 'Sistema de rate limiting anti-abuse',
                    description: 'Prevenir abuso de reenvios (max 5/hora) e tentativas (max 3 cÃ³digos errados)',
                    estimate: '4h',
                    assignee: 'Backend Developer',
                    status: 'Exportado'
                  }
                ],
                
                testCases: [
                  { 
                    id: 'TC-007', 
                    type: 'Functional',
                    priority: 'High',
                    title: 'Validar fluxo completo OTP',
                    preconditions: ['User autenticado', 'Saldo > 100â‚¬'],
                    steps: [
                      'Iniciar transferÃªncia de 100â‚¬',
                      'Sistema deteta valor > 50â‚¬',
                      'Sistema solicita OTP',
                      'Backend gera cÃ³digo TOTP',
                      'SMS enviado via SIBS',
                      'Utilizador recebe SMS em < 10s',
                      'Inserir cÃ³digo correto nos 6 campos',
                      'Sistema valida cÃ³digo e timestamp',
                      'TransaÃ§Ã£o processada'
                    ],
                    expectedResult: 'TransaÃ§Ã£o autorizada e processada com sucesso, comprovante gerado, saldo atualizado',
                    testData: 'Montante: 100â‚¬, TelemÃ³vel: +351 912 000 000'
                  },
                  { 
                    id: 'TC-008', 
                    type: 'Security',
                    priority: 'High',
                    title: 'Testar expiraÃ§Ã£o apÃ³s 3 minutos',
                    preconditions: ['OTP gerado e enviado'],
                    steps: [
                      'Receber OTP por SMS',
                      'NÃ£o inserir cÃ³digo',
                      'Aguardar exatamente 3 minutos e 1 segundo',
                      'Tentar usar cÃ³digo'
                    ],
                    expectedResult: 'CÃ³digo rejeitado com mensagem "CÃ³digo expirado", opÃ§Ã£o de solicitar novo cÃ³digo apresentada',
                    testData: 'Timer: 181 segundos'
                  }
                ]
              },
              {
                id: 'US-003',
                type: 'userStory',
                title: 'Registo de Dispositivo para SCA',
                asA: 'sistema de seguranÃ§a',
                iWant: 'registar e validar dispositivos usados pelos clientes',
                soThat: 'o dispositivo possa ser usado como fator "algo que tenho" no SCA',
                acceptanceCriteria: [
                  'Registo Ãºnico de dispositivo na primeira utilizaÃ§Ã£o',
                  'GeraÃ§Ã£o de device fingerprint (ID Ãºnico, modelo, OS, versÃ£o)',
                  'Armazenamento seguro de token no Keychain/Keystore',
                  'ValidaÃ§Ã£o de dispositivo em cada login',
                  'Alerta se login de dispositivo nÃ£o reconhecido',
                  'Limite de 5 dispositivos ativos por utilizador'
                ],
                priority: 'High',
                storyPoints: 8,
                status: 'Exportado',
                labels: ['Security', 'Device Management'],
                expanded: false,
                tasks: [],
                testCases: []
              }
            ]
          },
          {
            id: 'FT-002',
            type: 'feature',
            title: 'GestÃ£o de SessÃ£o e Timeout Regulamentar',
            description: 'Controlo rigoroso de sessÃµes conforme normas de seguranÃ§a do Banco de Portugal e boas prÃ¡ticas PSD2',
            priority: 'High',
            status: 'Exportado',
            businessRules: [
              'Timeout de inatividade: 5 minutos',
              'Aviso 30 segundos antes do timeout',
              'Limpeza completa de dados sensÃ­veis ao terminar sessÃ£o',
              'SessÃ£o Ãºnica por utilizador (logout automÃ¡tico em outros dispositivos)'
            ],
            expanded: false,
            userStories: []
          }
        ]
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'TransferÃªncias e Pagamentos MB Way',
        description: 'Sistema completo de transferÃªncias instantÃ¢neas P2P, pagamentos a comerciantes e gestÃ£o de limites',
        businessValue: 'Funcionalidade core que gera volume transacional e receita de comissÃµes para o banco',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: [
          'TransferÃªncias processadas em < 5 segundos (P95)',
          'IntegraÃ§Ã£o completa com rede SIBS',
          'Limites configurÃ¡veis por perfil de cliente',
          'Comprovantes digitais gerados imediatamente',
          'NotificaÃ§Ãµes push para remetente e destinatÃ¡rio'
        ],
        expanded: false,
        features: []
      },
      {
        id: 'EP-003',
        type: 'epic',
        title: 'Compliance e Auditoria BancÃ¡ria',
        description: 'Sistema de logs, auditoria e reports regulamentares para Banco de Portugal e BCE',
        businessValue: 'Garantir conformidade legal, evitar coimas regulamentares e permitir auditorias eficientes',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: [
          'Logs imutÃ¡veis (append-only) de todas as transaÃ§Ãµes',
          'RetenÃ§Ã£o de dados por 10 anos conforme legislaÃ§Ã£o',
          'Reports automÃ¡ticos mensais para Banco de Portugal',
          'Pista de auditoria completa com rastreabilidade end-to-end',
          'EncriptaÃ§Ã£o de dados em repouso e em trÃ¢nsito'
        ],
        expanded: false,
        features: []
      }
    ]
  },
  1: {
    id: 1,
    name: 'Sistema de Pagamentos MB Way',
    code: 'MBWAY-2024',
    department: 'Digital Payments',
    type: 'Mobile Banking',
    platform: 'Jira Cloud',
    version: 'v2.1.0',
    createdAt: new Date('2025-12-15'),
    lastExport: new Date('2026-01-08T14:30:00'),
    createdBy: 'Susana Gamito',
    description: 'Sistema de pagamentos mÃ³veis MB Way com integraÃ§Ã£o SIBS para transferÃªncias instantÃ¢neas P2P',
    objectives: [
      'Implementar transferÃªncias instantÃ¢neas via nÃºmero de telemÃ³vel',
      'Integrar com rede SIBS',
      'Garantir conformidade PSD2 e SCA'
    ],
    compliance: ['PSD2', 'GDPR', 'SIBS', 'SCA'],
    qualityScore: 98,
    url: 'https://company.atlassian.net/browse/MBWAY',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'AutenticaÃ§Ã£o e SeguranÃ§a PSD2',
        description: 'ImplementaÃ§Ã£o completa de SCA e biometria',
        businessValue: 'Conformidade regulamentar obrigatÃ³ria',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['SCA para transaÃ§Ãµes > 30â‚¬', 'Biometria validada', 'Logs 10 anos'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'TransferÃªncias InstantÃ¢neas',
        description: 'TransferÃªncias P2P via telemÃ³vel',
        businessValue: 'Core feature do produto',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['TransferÃªncia < 5 segundos', 'IntegraÃ§Ã£o SIBS', 'Limites configurÃ¡veis'],
        expanded: false,
        features: []
      }
    ]
  },
  2: {
    id: 2,
    name: 'Portal Homebanking Empresas',
    code: 'HBEMP-2024',
    department: 'Corporate Banking',
    type: 'Web Banking',
    platform: 'Azure DevOps',
    version: 'v1.5.2',
    createdAt: new Date('2025-11-20'),
    lastExport: new Date('2026-01-06T09:15:00'),
    createdBy: 'JoÃ£o Santos',
    description: 'Portal web de homebanking para empresas com gestÃ£o multi-utilizador e aprovaÃ§Ãµes multinÃ­vel',
    objectives: [
      'GestÃ£o centralizada de contas empresariais',
      'Workflow de aprovaÃ§Ãµes customizÃ¡vel',
      'ExportaÃ§Ã£o para ERP'
    ],
    compliance: ['PSD2', 'GDPR', 'Banco de Portugal', 'AML'],
    qualityScore: 95,
    url: 'https://dev.azure.com/company/HBEMP',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'GestÃ£o Multi-Utilizador',
        description: 'Sistema de permissÃµes e roles empresariais',
        businessValue: 'Controlo de acesso granular',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['Roles customizÃ¡veis', 'Audit trail completo', 'SSO corporativo'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'Workflow de AprovaÃ§Ãµes',
        description: 'AprovaÃ§Ã£o multinÃ­vel de pagamentos',
        businessValue: 'Controlo financeiro empresarial',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['Multi-assinatura configurÃ¡vel', 'NotificaÃ§Ãµes push', 'Prazos de aprovaÃ§Ã£o'],
        expanded: false,
        features: []
      }
    ]
  },
  3: {
    id: 3,
    name: 'App Mobile Banking Particulares',
    code: 'MOBPART-2024',
    department: 'Retail Banking',
    type: 'Mobile Banking',
    platform: 'Jira Cloud',
    version: 'v3.0.1',
    createdAt: new Date('2025-10-05'),
    lastExport: new Date('2026-01-05T16:45:00'),
    createdBy: 'Maria Costa',
    description: 'App mobile nativa iOS/Android para clientes particulares com gestÃ£o completa de contas',
    objectives: [
      'ExperiÃªncia mobile-first',
      'Onboarding digital completo',
      'GestÃ£o de cartÃµes e investimentos'
    ],
    compliance: ['PSD2', 'GDPR', 'SIBS', 'AML', 'KYC'],
    qualityScore: 97,
    url: 'https://company.atlassian.net/browse/MOBPART',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'Onboarding Digital',
        description: 'Abertura de conta 100% digital',
        businessValue: 'Reduzir abandono e custos de aquisiÃ§Ã£o',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['KYC automÃ¡tico', 'Liveness detection', 'ValidaÃ§Ã£o CC/Passaporte'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'GestÃ£o de CartÃµes',
        description: 'Controlo total de cartÃµes de dÃ©bito/crÃ©dito',
        businessValue: 'Autonomia do cliente',
        priority: 'Medium',
        status: 'Exportado',
        acceptanceCriteria: ['Ativar/desativar cartÃ£o', 'Alterar limites', 'Ver PIN'],
        expanded: false,
        features: []
      }
    ]
  },
  4: {
    id: 4,
    name: 'Plataforma Multibanco ATM',
    code: 'MBATM-2024',
    department: 'Channels & Payments',
    type: 'Core Banking',
    platform: 'Jira Cloud',
    version: 'v1.2.0',
    createdAt: new Date('2025-09-10'),
    lastExport: new Date('2026-01-02T11:20:00'),
    createdBy: 'Pedro Oliveira',
    description: 'Plataforma de gestÃ£o de ATM Multibanco com integraÃ§Ã£o SIBS',
    objectives: [
      'Modernizar interface ATM',
      'IntegraÃ§Ã£o com rede Multibanco',
      'Conformidade EMV e Chip&PIN'
    ],
    compliance: ['PSD2', 'SIBS', 'Banco de Portugal', 'EMV'],
    qualityScore: 100,
    url: 'https://company.atlassian.net/browse/MBATM',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'Interface ATM Modernizada',
        description: 'Nova UX para terminais ATM',
        businessValue: 'Melhorar experiÃªncia e acessibilidade',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['Acessibilidade WCAG 2.1', 'Suporte multi-idioma', 'Timeout seguro'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'IntegraÃ§Ã£o SIBS',
        description: 'ConexÃ£o com rede Multibanco',
        businessValue: 'OperaÃ§Ã£o na rede nacional',
        priority: 'Critical',
        status: 'Exportado',
        acceptanceCriteria: ['Protocolo SIBS validado', 'ReconciliaÃ§Ã£o automÃ¡tica', 'Failover'],
        expanded: false,
        features: []
      }
    ]
  },
  5: {
    id: 5,
    name: 'API Open Banking PSD2',
    code: 'OPENAPI-2024',
    department: 'Open Banking',
    type: 'APIs / Open Banking',
    platform: 'Azure DevOps',
    version: 'v2.0.3',
    createdAt: new Date('2025-08-25'),
    lastExport: new Date('2025-12-28T10:00:00'),
    createdBy: 'Susana Gamito',
    description: 'APIs RESTful PSD2 para Third Party Providers (TPP)',
    objectives: [
      'Conformidade PSD2 total',
      'APIs para AISP, PISP, CISP',
      'SeguranÃ§a OAuth2 + mTLS'
    ],
    compliance: ['PSD2', 'GDPR', 'SCA', 'OAuth2'],
    qualityScore: 96,
    url: 'https://dev.azure.com/company/OPENAPI',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'Account Information Service (AISP)',
        description: 'APIs de consulta de contas para TPP',
        businessValue: 'Conformidade PSD2 obrigatÃ³ria',
        priority: 'Critical',
        status: 'Exportado',
        acceptanceCriteria: ['OAuth2 + mTLS', 'Rate limiting', 'Consent management'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'Payment Initiation Service (PISP)',
        description: 'APIs de iniciaÃ§Ã£o de pagamentos',
        businessValue: 'Novos canais de pagamento',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['SCA obrigatÃ³ria', 'Webhook confirmaÃ§Ã£o', 'IdempotÃªncia'],
        expanded: false,
        features: []
      }
    ]
  },
  6: {
    id: 6,
    name: 'Portal Backoffice OperaÃ§Ãµes',
    code: 'BACKOPS-2024',
    department: 'Operations',
    type: 'Backoffice',
    platform: 'Jira Cloud',
    version: 'v1.8.1',
    createdAt: new Date('2025-07-15'),
    lastExport: new Date('2025-12-20T15:30:00'),
    createdBy: 'Carlos Mendes',
    description: 'Portal interno para operadores de backoffice processar operaÃ§Ãµes e reclamaÃ§Ãµes',
    objectives: [
      'Processar operaÃ§Ãµes de clientes',
      'GestÃ£o de reclamaÃ§Ãµes',
      'Reports regulamentares automÃ¡ticos'
    ],
    compliance: ['GDPR', 'Banco de Portugal', 'AML', 'Audit Trail'],
    qualityScore: 94,
    url: 'https://company.atlassian.net/browse/BACKOPS',
    structure: [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'Processamento de OperaÃ§Ãµes',
        description: 'Ferramentas para operadores processarem operaÃ§Ãµes',
        businessValue: 'EficiÃªncia operacional',
        priority: 'High',
        status: 'Exportado',
        acceptanceCriteria: ['Interface rÃ¡pida', 'ValidaÃ§Ãµes automÃ¡ticas', 'HistÃ³rico completo'],
        expanded: false,
        features: []
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'GestÃ£o de ReclamaÃ§Ãµes',
        description: 'Workflow de tratamento de reclamaÃ§Ãµes',
        businessValue: 'Conformidade Banco de Portugal',
        priority: 'Medium',
        status: 'Exportado',
        acceptanceCriteria: ['SLA tracking', 'Templates de resposta', 'EscalaÃ§Ã£o automÃ¡tica'],
        expanded: false,
        features: []
      }
    ]
  }
};

export function ProjectView({ onNavigate, projectId }: ProjectViewProps = {}) {
  const navigate = useNavigate();
  const params = useParams<{ projectId: string }>();
  const { agentService } = useAgent();
  const { logAction } = useAudit();
  const effectiveProjectId = projectId ?? (params.projectId ? Number(params.projectId) : null);

  const navigateByView = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    const map: Record<View, string> = {
      dashboard: '/dashboard',
      'new-project': '/new-project',
      'project-builder': '/project-builder',
      'project-view': `/project/${effectiveProjectId ?? 1}`,
      templates: '/templates',
      library: '/library',
      integrations: '/integrations',
      audit: '/audit',
    };
    navigate(map[view]);
  };

  const project = effectiveProjectId ? projectsData[effectiveProjectId] : null;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'EP-001': true,
    'FT-001': true,
    'US-001': true
  });
  const [showAllDetails, setShowAllDetails] = useState(true);
  const [activeTab, setActiveTab] = useState('structure');
  const [isExporting, setIsExporting] = useState(false);

  if (!project) {
    return (
      <div className="p-8">
        <Button onClick={() => navigateByView('dashboard')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
        <p className="mt-4 text-slate-600">Projeto nÃ£o encontrado</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalStats = {
    epics: project.structure.length,
    features: project.structure.reduce((acc: number, ep: any) => acc + ep.features.length, 0),
    userStories: project.structure.reduce((acc: number, ep: any) => 
      acc + ep.features.reduce((acc2: number, ft: any) => acc2 + ft.userStories.length, 0), 0
    ),
    tasks: project.structure.reduce((acc: number, ep: any) => 
      acc + ep.features.reduce((acc2: number, ft: any) => 
        acc2 + ft.userStories.reduce((acc3: number, us: any) => acc3 + us.tasks.length, 0), 0
      ), 0
    ),
    testCases: project.structure.reduce((acc: number, ep: any) => 
      acc + ep.features.reduce((acc2: number, ft: any) => 
        acc2 + ft.userStories.reduce((acc3: number, us: any) => acc3 + us.testCases.length, 0), 0
      ), 0
    ),
    totalStoryPoints: project.structure.reduce((acc: number, ep: any) => 
      acc + ep.features.reduce((acc2: number, ft: any) => 
        acc2 + ft.userStories.reduce((acc3: number, us: any) => acc3 + (us.storyPoints || 0), 0), 0
      ), 0
    ),
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical':
      case 'High': 
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': 
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': 
        return 'bg-green-50 text-green-700 border-green-200';
      default: 
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch(type) {
      case 'Functional': 
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Security': 
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Performance': 
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Integration': 
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Compliance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default: 
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const response = await agentService.exportToplatform(
        project.structure,
        project.platform,
        project.code
      );
      logAction({
        action: 'Exportacao executada',
        actionType: 'export',
        user: 'Susana Gamito',
        userInitials: 'SG',
        project: project.code,
        projectName: project.name,
        details: `${response.data.itemsExported} itens exportados para ${project.platform}`,
        status: 'success',
      });
      window.alert(`Exportacao concluida com sucesso: ${response.data.itemsExported} itens.`);
    } catch (error) {
      logAction({
        action: 'Falha na exportacao',
        actionType: 'export',
        user: 'Susana Gamito',
        userInitials: 'SG',
        project: project.code,
        projectName: project.name,
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 'error',
      });
      window.alert('Falha na exportacao. Verifique a configuracao do provider de agentes.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigateByView('dashboard')}
          className="mb-4 gap-2 -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                  {project.name}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-mono">{project.code}</Badge>
                  <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {project.version}
                  </Badge>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-slate-600">{project.department}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge variant="secondary">{project.type}</Badge>
                </div>
                <p className="text-slate-600 max-w-3xl">
                  {project.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={handleExport} disabled={isExporting}>`n                  <Download className="w-4 h-4" />`n                  {isExporting ? 'A exportar...' : 'Exportar'}`n                </Button>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Abrir em {project.platform}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        const result = await agentService.generateVersionDiff(
                          project.structure,
                          project.structure,
                          project.version
                        );
                        window.alert(`Historico de versoes: ${result.data.previousVersion} -> ${result.data.nextVersion}`);
                      }}
                    >
                      Histórico de Versões
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard?.writeText(project.code);
                        window.alert(`Projeto ${project.code} preparado para duplicacao.`);
                      }}
                    >
                      Duplicar Projeto
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExport}>Exportar Novamente</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Criado:</span>
                <span className="font-medium text-slate-900">{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Exportado:</span>
                <span className="font-medium text-slate-900">{formatDate(project.lastExport)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Por:</span>
                <span className="font-medium text-slate-900">{project.createdBy}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-slate-600">Qualidade:</span>
                <span className="font-medium text-green-700">{project.qualityScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="grid grid-cols-6 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.epics}</p>
              <p className="text-xs text-slate-600">Epics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.features}</p>
              <p className="text-xs text-slate-600">Features</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.userStories}</p>
              <p className="text-xs text-slate-600">User Stories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.tasks}</p>
              <p className="text-xs text-slate-600">Tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.testCases}</p>
              <p className="text-xs text-slate-600">Test Cases</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalStats.totalStoryPoints}</p>
              <p className="text-xs text-slate-600">Story Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="structure">Estrutura Completa</TabsTrigger>
                <TabsTrigger value="overview">VisÃ£o Geral</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="exports">HistÃ³rico ExportaÃ§Ãµes</TabsTrigger>
              </TabsList>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAllDetails(!showAllDetails)}
                className="gap-2"
              >
                {showAllDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAllDetails ? 'Ocultar' : 'Mostrar'} Detalhes
              </Button>
            </div>

            <TabsContent value="structure" className="space-y-4">
              {project.structure.map((epic: any) => (
                <EpicCard 
                  key={epic.id} 
                  epic={epic} 
                  expanded={expandedItems[epic.id]}
                  onToggle={() => toggleExpand(epic.id)}
                  expandedItems={expandedItems}
                  onToggleItem={toggleExpand}
                  showAllDetails={showAllDetails}
                  getPriorityColor={getPriorityColor}
                  getTestTypeColor={getTestTypeColor}
                />
              ))}
            </TabsContent>

            <TabsContent value="overview">
              <Card className="p-6 border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Objetivos do Projeto</h3>
                <ul className="space-y-2">
                  {project.objectives.map((obj: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card className="p-6 border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Tags de Compliance</h3>
                <div className="flex flex-wrap gap-2">
                  {project.compliance.map((tag: string) => (
                    <Badge key={tag} className="bg-green-50 text-green-700 border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="exports">
              <Card className="p-6 border-slate-200">
                <p className="text-slate-600">HistÃ³rico de exportaÃ§Ãµes para {project.platform}</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Componente Epic Card (hierÃ¡rquico)
function EpicCard({ epic, expanded, onToggle, expandedItems, onToggleItem, showAllDetails, getPriorityColor, getTestTypeColor }: any) {
  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="p-6 bg-slate-50">
        <div className="flex items-start gap-4">
          <button onClick={onToggle} className="mt-1">
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <Badge className="bg-blue-600 text-white hover:bg-blue-600 font-mono">{epic.id}</Badge>
              <h3 className="text-lg font-semibold text-slate-900">{epic.title}</h3>
              <Badge className={getPriorityColor(epic.priority)}>{epic.priority}</Badge>
              <Badge variant="secondary">{epic.status}</Badge>
            </div>
            
            <p className="text-slate-700 mb-3 ml-8">{epic.description}</p>
            
            {showAllDetails && (
              <div className="ml-8 space-y-3">
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Valor de NegÃ³cio:</p>
                    <p className="text-sm text-slate-600">{epic.businessValue}</p>
                  </div>
                </div>
                
                {epic.acceptanceCriteria && epic.acceptanceCriteria.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">CritÃ©rios de AceitaÃ§Ã£o:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {epic.acceptanceCriteria.map((criteria: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600">â€¢</span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-slate-600">
            <p>{epic.features.length} Features</p>
          </div>
        </div>
      </div>

      {expanded && epic.features.length > 0 && (
        <div className="p-6 pt-0 space-y-4">
          {epic.features.map((feature: any) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              epicId={epic.id}
              expanded={expandedItems[feature.id]}
              onToggle={() => onToggleItem(feature.id)}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
              showAllDetails={showAllDetails}
              getPriorityColor={getPriorityColor}
              getTestTypeColor={getTestTypeColor}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

// Componente Feature Card
function FeatureCard({ feature, epicId, expanded, onToggle, expandedItems, onToggleItem, showAllDetails, getPriorityColor, getTestTypeColor }: any) {
  return (
    <div className="ml-8 border-l-4 border-purple-300 pl-6">
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <button onClick={onToggle}>
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-purple-600" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Boxes className="w-4 h-4 text-purple-600" />
              <Badge variant="outline" className="border-purple-600 text-purple-600 font-mono">
                {feature.id}
              </Badge>
              <span className="font-semibold text-slate-900">{feature.title}</span>
              <Badge className={getPriorityColor(feature.priority)}>{feature.priority}</Badge>
              <Badge variant="secondary">{feature.status}</Badge>
            </div>
            <p className="text-sm text-slate-600 ml-6">{feature.description}</p>

            {showAllDetails && feature.businessRules && feature.businessRules.length > 0 && (
              <div className="ml-6 mt-3 p-3 bg-white rounded border border-purple-200">
                <p className="text-xs font-medium text-purple-900 mb-2">Regras de NegÃ³cio:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {feature.businessRules.map((rule: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600">â–ª</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-600">
            {feature.userStories.length} US
          </div>
        </div>

        {expanded && feature.userStories.length > 0 && (
          <div className="mt-4 ml-6 space-y-3">
            {feature.userStories.map((us: any) => (
              <UserStoryCard
                key={us.id}
                userStory={us}
                expanded={expandedItems[us.id]}
                onToggle={() => onToggleItem(us.id)}
                showAllDetails={showAllDetails}
                getPriorityColor={getPriorityColor}
                getTestTypeColor={getTestTypeColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente User Story Card (com tasks e test cases detalhados)
function UserStoryCard({ userStory, expanded, onToggle, showAllDetails, getPriorityColor, getTestTypeColor }: any) {
  return (
    <div className="border-l-4 border-green-300 pl-4">
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <button onClick={onToggle}>
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-green-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-green-600" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <FileText className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="border-green-600 text-green-600 font-mono text-xs">
                {userStory.id}
              </Badge>
              <span className="font-medium text-sm text-slate-900">{userStory.title}</span>
              <Badge className={`${getPriorityColor(userStory.priority)} text-xs`}>{userStory.priority}</Badge>
              <Badge variant="secondary" className="text-xs">{userStory.storyPoints} SP</Badge>
              {userStory.labels && userStory.labels.map((label: string) => (
                <Badge key={label} variant="outline" className="text-xs">{label}</Badge>
              ))}
            </div>
            
            <div className="text-xs text-slate-700 ml-6 space-y-1">
              <p><span className="font-medium">Como</span> {userStory.asA},</p>
              <p><span className="font-medium">Eu quero</span> {userStory.iWant},</p>
              <p><span className="font-medium">Para que</span> {userStory.soThat}</p>
            </div>

            {expanded && showAllDetails && (
              <div className="mt-4 ml-6 space-y-4">
                {/* Acceptance Criteria */}
                {userStory.acceptanceCriteria && userStory.acceptanceCriteria.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      CritÃ©rios de AceitaÃ§Ã£o:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {userStory.acceptanceCriteria.map((criteria: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {userStory.tasks && userStory.tasks.length > 0 && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-900">
                        Tasks TÃ©cnicas ({userStory.tasks.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {userStory.tasks.map((task: any) => (
                        <div key={task.id} className="bg-white p-3 rounded border border-orange-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-slate-500">{task.id}</span>
                                <span className="text-xs font-medium text-slate-900">{task.title}</span>
                              </div>
                              <p className="text-xs text-slate-600 mb-2">{task.description}</p>
                              {task.technicalNotes && (
                                <div className="p-2 bg-slate-50 rounded border border-slate-200 mb-2">
                                  <p className="text-xs text-slate-700">
                                    <span className="font-medium">Notas tÃ©cnicas:</span> {task.technicalNotes}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {task.estimate}
                                </Badge>
                                {task.assignee && (
                                  <Badge variant="outline" className="text-xs">
                                    <User className="w-3 h-3 mr-1" />
                                    {task.assignee}
                                  </Badge>
                                )}
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Cases */}
                {userStory.testCases && userStory.testCases.length > 0 && (
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-900">
                        Casos de Teste ({userStory.testCases.length})
                      </span>
                    </div>
                    <div className="space-y-3">
                      {userStory.testCases.map((tc: any) => (
                        <div key={tc.id} className="bg-white p-3 rounded border border-indigo-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-500">{tc.id}</span>
                              <span className="text-xs font-medium text-slate-900">{tc.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getTestTypeColor(tc.type)} text-xs`}>
                                {tc.type}
                              </Badge>
                              <Badge className={`${getPriorityColor(tc.priority)} text-xs`}>
                                {tc.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-xs space-y-2">
                            {tc.preconditions && tc.preconditions.length > 0 && (
                              <div>
                                <p className="font-medium text-slate-700 mb-1">PrÃ©-condiÃ§Ãµes:</p>
                                <ul className="text-slate-600 space-y-0.5 pl-4">
                                  {tc.preconditions.map((pre: string, idx: number) => (
                                    <li key={idx} className="list-disc">{pre}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div>
                              <p className="font-medium text-slate-700 mb-1">Passos:</p>
                              <ol className="text-slate-600 space-y-1 pl-4">
                                {tc.steps.map((step: string, idx: number) => (
                                  <li key={idx} className="list-decimal">{step}</li>
                                ))}
                              </ol>
                            </div>
                            
                            <div>
                              <p className="font-medium text-slate-700 mb-1">Resultado Esperado:</p>
                              <p className="text-slate-600 p-2 bg-green-50 rounded border border-green-200">
                                {tc.expectedResult}
                              </p>
                            </div>

                            {tc.testData && (
                              <div>
                                <p className="font-medium text-slate-700 mb-1">Dados de Teste:</p>
                                <p className="text-slate-600 p-2 bg-slate-50 rounded border border-slate-200 font-mono">
                                  {tc.testData}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-600">
            <p>{userStory.tasks?.length || 0} Tasks</p>
            <p>{userStory.testCases?.length || 0} Tests</p>
          </div>
        </div>
      </div>
    </div>
  );
}


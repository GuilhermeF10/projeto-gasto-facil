import { create } from 'zustand';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/src/config/firebase';

export type Gasto = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  imagemUri?: string;
  uid: string;
};

export type NovoGasto = {
  descricao: string;
  valor: number;
  categoria: string;
  imagemUri?: string;
};

type GastosState = {
  gastos: Gasto[];
  carregando: boolean;
  /** Assina os gastos do usuário em tempo real. Retorna a função de cancelamento. */
  assinarGastos: (uid: string) => () => void;
  limpar: () => void;
  adicionarGasto: (uid: string, gasto: NovoGasto) => Promise<void>;
  editarGasto: (id: string, dados: NovoGasto) => Promise<void>;
  removerGasto: (id: string) => Promise<void>;
};

const COLECAO = 'gastos';

export const useGastosStore = create<GastosState>((set) => ({
  gastos: [],
  carregando: false,

  assinarGastos: (uid) => {
    set({ carregando: true });

    // Filtra apenas por uid e ordena no cliente, evitando exigir
    // um índice composto no Firestore (where + orderBy em campos distintos).
    const q = query(collection(db, COLECAO), where('uid', '==', uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const gastos: Gasto[] = snapshot.docs
          .map((documento) => {
            const dados = documento.data();
            const createdAt = dados.createdAt as Timestamp | null;
            return {
              id: documento.id,
              descricao: dados.descricao ?? '',
              valor: Number(dados.valor) || 0,
              data: dados.data ?? '',
              categoria: dados.categoria ?? 'outros',
              imagemUri: dados.imagemUri || undefined,
              uid: dados.uid,
              _ordem: createdAt?.toMillis() ?? 0,
            };
          })
          .sort((a, b) => b._ordem - a._ordem)
          .map(({ _ordem, ...gasto }) => gasto);

        set({ gastos, carregando: false });
      },
      () => {
        set({ carregando: false });
      }
    );

    return unsubscribe;
  },

  limpar: () => set({ gastos: [], carregando: false }),

  adicionarGasto: async (uid, gasto) => {
    await addDoc(collection(db, COLECAO), {
      uid,
      descricao: gasto.descricao,
      valor: gasto.valor,
      categoria: gasto.categoria,
      imagemUri: gasto.imagemUri ?? null,
      data: new Date().toLocaleDateString('pt-BR'),
      createdAt: serverTimestamp(),
    });
  },

  editarGasto: async (id, dados) => {
    await updateDoc(doc(db, COLECAO, id), {
      descricao: dados.descricao,
      valor: dados.valor,
      categoria: dados.categoria,
      imagemUri: dados.imagemUri ?? null,
    });
  },

  removerGasto: async (id) => {
    await deleteDoc(doc(db, COLECAO, id));
  },
}));

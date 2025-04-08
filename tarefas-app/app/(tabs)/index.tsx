import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

const APP_ID = 'Xc6djBVVdD6G5Nqp6hF9tpcxq7dZe13jyN6IlUIl';
const REST_API_KEY = 'PqMYVbAeFnYrsy2hI2dYAZnsmd0if2fmBJn2L0w7';
const URL = 'https://parseapi.back4app.com/classes/Tarefa';

export default function HomeScreen() {
  const [descricao, setDescricao] = useState('');
  const [tarefas, setTarefas] = useState([]);

  const headers = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json',
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch(URL, { headers });
      const text = await response.text();
      const json = JSON.parse(text);
      setTarefas(json.results);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const adicionarTarefa = async () => {
    if (!descricao.trim()) return;

    const novaTarefa = {
      descricao,
      concluida: false,
    };

    try {
      await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(novaTarefa),
      });

      setDescricao('');
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const alternarConclusao = async (tarefa) => {
    try {
      await fetch(`${URL}/${tarefa.objectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ concluida: !tarefa.concluida }),
      });

      buscarTarefas();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const limparTarefas = async () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja apagar todas as tarefas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              const promises = tarefas.map((tarefa) =>
                fetch(`${URL}/${tarefa.objectId}`, {
                  method: 'DELETE',
                  headers,
                })
              );
              await Promise.all(promises);
              setTarefas([]);
            } catch (error) {
              console.error('Erro ao apagar tarefas:', error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const tarefasPendentes = tarefas.filter((t) => !t.concluida);
  const tarefasConcluidas = tarefas.filter((t) => t.concluida);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Minhas Tarefas</Text>

        <TextInput
          style={styles.input}
          placeholder="O que você precisa fazer?"
          placeholderTextColor="#aa86b6"
          value={descricao}
          onChangeText={setDescricao}
        />

        <View style={styles.botoesLinha}>
          <Pressable style={styles.botao} onPress={adicionarTarefa}>
            <Text style={styles.botaoTexto}>Adicionar</Text>
          </Pressable>
          <Pressable style={[styles.botao, styles.botaoLimpar]} onPress={limparTarefas}>
            <Text style={styles.botaoTexto}>Limpar Tudo</Text>
          </Pressable>
        </View>

        <View style={styles.secaoLista}>
          <Text style={styles.subtitulo}>A Fazer</Text>
          {tarefasPendentes.length === 0 ? (
            <Text style={styles.nenhuma}>Tudo feito por aqui</Text>
          ) : (
            tarefasPendentes.map((item) => (
              <TouchableOpacity
                key={item.objectId}
                onPress={() => alternarConclusao(item)}
              >
                <View style={styles.cartaoPendente}>
                  <Text style={styles.textoPendente}>{item.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.secaoLista}>
          <Text style={styles.subtitulo}>Concluídas</Text>
          {tarefasConcluidas.length === 0 ? (
            <Text style={styles.nenhuma}>Você ainda não concluiu nada</Text>
          ) : (
            tarefasConcluidas.map((item) => (
              <TouchableOpacity
                key={item.objectId}
                onPress={() => alternarConclusao(item)}
              >
                <View style={styles.cartaoConcluido}>
                  <Text style={styles.textoConcluido}>{item.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f6',
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    color: '#a94ca0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e4c1f9',
    backgroundColor: '#fce4ec',
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#5a285d',
  },
  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  botao: {
    flex: 1,
    backgroundColor: '#e295b5',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#e295b5',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  botaoLimpar: {
    backgroundColor: '#f45c96',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secaoLista: {
    marginTop: 24,
    backgroundColor: '#fff9fb',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#dbb3d8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#d172b5',
    marginBottom: 10,
    textAlign: 'center',
  },
  nenhuma: {
    textAlign: 'center',
    color: '#b88caa',
    fontStyle: 'italic',
    fontSize: 14,
  },
  cartaoPendente: {
    backgroundColor: '#ffe3ec',
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f78fb3',
    borderRadius: 14,
  },
  cartaoConcluido: {
    backgroundColor: '#d3c0e3',
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#9c88ff',
    borderRadius: 14,
  },
  textoPendente: {
    fontSize: 16,
    color: '#6d326d',
  },
  textoConcluido: {
    fontSize: 16,
    color: '#4a2d64',
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
});
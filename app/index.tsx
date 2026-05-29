import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// O redirecionamento (login ou tabs) é decidido pelo gate de auth em app/_layout.tsx,
// conforme a sessão do Firebase. Aqui só exibimos um carregamento.
export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FC',
  },
});

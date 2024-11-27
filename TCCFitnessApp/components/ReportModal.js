import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Markdown from 'react-native-markdown-display';
import api from '../axiosConfig';

const MarkdownModal = ({ isVisible, onClose, currentDate }) => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMarkdown = async () => {
            if (!isVisible) return;

            setIsLoading(true);
            try {
                const response = await api.get(`/users/me/daily-report?date=${currentDate}`);
                setMarkdownContent(response.data.generated_text);
            } catch (error) {
                console.error('Erro ao buscar conteúdo Markdown:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarkdown();
    }, [currentDate, isVisible]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FF6624" />
                ) : (
                    <ScrollView>
                        <Markdown style={markdownStyles}>
                            {String(markdownContent || 'Nenhum conteúdo disponível.')}
                        </Markdown>
                    </ScrollView>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        maxHeight: '80%',
    },
    closeButton: {
        backgroundColor: '#FF0000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

const markdownStyles = {
    heading1: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    heading2: { fontSize: 24, fontWeight: 'bold', color: '#666' },
    paragraph: { fontSize: 18, color: '#444' },
    listItem: { fontSize: 18, color: '#444' },
    blockquote: { fontSize: 18, color: '#666', fontStyle: 'italic', paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: '#ccc' },
    codeBlock: {
        fontSize: 16,
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 8,
        fontFamily: 'monospace',
    },
};

export default MarkdownModal;

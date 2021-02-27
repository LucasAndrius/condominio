import React,{ useState, useEffect}from 'react';
import { 
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, 
    CDataTable, 
    CFormGroup, 
    CInput, 
    CLabel, 
    CModal, 
    CModalBody, 
    CModalFooter, 
    CModalHeader, 
    CRow, 
    CTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';


import useApi from '../services/api';


export default () =>{

    const [ loading, setLoading] = useState(true);
    const [list,setList] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [ modalLoading,setModalLoading] = useState(false);
    const [modalTitleField,setModalTitleField] =  useState('');
    const [modalBodyField,setModalBodyField] =  useState('');
    const [ modalId, setModalId] = useState('');


    const fields = [
        {label:'Titulo', key:'title' },
        {label:'Data de Criação', key:'datecreated',_style:{width:'250px'}},
        {label:'Ações',key:'actions',_style:{width:'1px'}},
    ]


    const api = useApi();
    useEffect(()=>{
        getList();
    },[]);




    const getList = async () =>{
        setLoading(true);

        const result = await api.getWall(); //processo de requisição
        
        setLoading(false);

        if(result.error === '') {
            setList(result.list);
        } else {
            alert(result.error);
        }
    }


    const handleCloseModal = () =>{
        setShowModal(false);
    }

    const handleEditButton = (index) =>{
        setModalId(list[index]['id']);
        setModalTitleField(list[index]['title']);
        setModalBodyField(list[index]['body']);
        setShowModal(true);

    }

    const handleModalSave =  async () => {
        if(modalBodyField && modalTitleField){
            setModalLoading(true);
            const result = await api.updateWall(modalId,{
                title:modalTitleField,
                body:modalTitleField
            });
            setModalLoading(false);
            if(result.error === ''){
                setShowModal(false);
                getList(); //vai atualizar a lista se tudo deu certo
            } else {
                alert(result.error);
            }
        } else {
            alert("Preencha os campos para continuar!");
        }
    }

    return (
        <>
            <CRow>
                <CCol>

                    <h2>Mural de Avisos</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton color="primary">
                                <CIcon 
                                name="cil-check" />
                                
                                Novo Aviso
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            
                            <CDataTable
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot=' '
                                hover
                                striped
                                bordered
                                pagination
                                itemsPerPage={5}
                                scopedSlots={{
                                    'actions':(item,index) =>(
                                        <td>
                                            <CButtonGroup>
                                                <CButton color="info" onClick={()=>handleEditButton(index)}>Editar</CButton>
                                                <CButton color="danger">Excluir</CButton>
                                            </CButtonGroup>
                                        </td>
                                    )
                                }}
                            />

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>


            <CModal show={showModal} onClose={handleCloseModal}>

                <CModalHeader closeButton>
                    Editar Aviso
                </CModalHeader>

                <CModalBody>

                    <CFormGroup>
                        <CLabel htmlFor="modal-title">Título do aviso</CLabel>
                        <CInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite um título para o aviso"
                            value={modalTitleField}
                            onChange={e=>setModalTitleField(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>  

                    <CFormGroup>
                        <CLabel htmlFor="modal-body">Corpo do aviso</CLabel>
                        <CTextarea
                            id="modal-body"
                            placeholder="Digite o conteúdo do aviso"
                            value={modalBodyField}
                            onChange={e=>setModalBodyField(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>   

                </CModalBody>
                <CModalFooter>

                    <CButton 
                        color="primary" 
                        onClick={handleModalSave}
                        disabled={modalLoading}
                        >

                            {setModalLoading? 'Carregando...': 'Salvar'}
                            
                    </CButton>

                    <CButton 
                        color="secondary" 
                        onClick={handleCloseModal}
                        disabled={modalLoading}
                        >
                            Cancelar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}
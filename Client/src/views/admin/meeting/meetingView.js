import { CloseIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons'
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from "components/spinner/Spinner"
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getApi, deleteApi } from 'services/api'
import { useNavigate } from 'react-router-dom';
import { HasAccess } from "../../../redux/accessUtils";
import CommonDeleteModel from 'components/commonDeleteModel';
import { toast } from 'react-toastify';

const MeetingView = (props) => {
    const { onClose, isOpen, info, fetchData, setAction, action, access } = props
    const [data, setData] = useState();
    const [deleteModel, setDelete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const navigate = useNavigate()

    const fetchViewData = async () => {
        if (info) {
            setIsLoding(true)
            try {
                let result = await getApi('api/meeting/view/', info?.event ? info?.event?.id : info);
                if (result?.status === 200) {
                    setData(result?.data?.data || result?.data);
                }
            } catch (error) {
                console.error('Error fetching meeting data:', error);
                toast.error('Failed to fetch meeting data');
            } finally {
                setIsLoding(false)
            }
        }
    }

    useEffect(() => {
        fetchViewData()
    }, [action, info])

    const handleViewOpen = () => {
        if (info?.event) {
            navigate(`/metting/${info?.event?.id}`)
        }
        else {
            navigate(`/metting/${info}`)
        }
    }

    const handleDelete = async (id) => {
        try {
            setIsLoding(true)
            let response = await deleteApi('api/meeting/delete/', id)
            if (response.status === 200) {
                toast.success('Meeting deleted successfully');
                setDelete(false)
                onClose(false)
                if (setAction) setAction((pre) => !pre)
                if (fetchData) fetchData()
            }
        } catch (error) {
            console.error('Error deleting meeting:', error)
            toast.error('Failed to delete meeting');
        } finally {
            setIsLoding(false)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} size={'md'} isCentered>
                <ModalOverlay />
                <ModalContent height={"60%"}>
                    <ModalHeader justifyContent='space-between' display='flex' >
                        Meeting Details
                        <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                    </ModalHeader>
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} mb={30} width="100%" >
                            <Spinner />
                        </Flex> : <>
                            <ModalBody overflowY={"auto"}>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3} >
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Agenda </Text>
                                        <Text fontSize="sm" color={'gray.600'}>{data?.agenda ? data?.agenda : ' - '}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created By </Text>
                                        <Text fontSize="sm" color={'gray.600'}>{data?.createdByName ? data?.createdByName : data?.createBy?.firstName + ' ' + data?.createBy?.lastName || '-'}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Created Date </Text>
                                        <Text fontSize="sm" color={'gray.600'}>{data?.createdDate ? moment(data?.createdDate).format('MMMM Do YYYY, h:mm A') : '-'}</Text>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <Text fontSize="sm" fontWeight="bold" color={'blackAlpha.900'}> Time Stamp </Text>
                                        <Text fontSize="sm" color={'gray.600'}>{data?.timestamp ? moment(data?.timestamp).format('MMMM Do YYYY, h:mm A') : '-'}</Text>
                                    </GridItem>
                                </Grid>
                            </ModalBody>
                            <DrawerFooter>
                                {(access?.view || user?.role === "superAdmin") && (
                                    <IconButton 
                                        variant='outline' 
                                        colorScheme={'green'} 
                                        onClick={handleViewOpen} 
                                        borderRadius="10px" 
                                        size="md" 
                                        icon={<ViewIcon />}
                                        title="View Details"
                                    />
                                )}
                                {(access?.delete || user?.role === "superAdmin") && (
                                    <IconButton 
                                        colorScheme='red' 
                                        onClick={() => setDelete(true)} 
                                        ml={3} 
                                        borderRadius="10px" 
                                        size="md" 
                                        icon={<DeleteIcon />}
                                        title="Delete Meeting"
                                    />
                                )}
                            </DrawerFooter>
                        </>}
                </ModalContent>
            </Modal>

            <CommonDeleteModel 
                isOpen={deleteModel} 
                onClose={() => setDelete(false)} 
                type='Meeting' 
                handleDeleteData={handleDelete} 
                ids={info?.event ? info?.event?.id : info} 
            />
        </>
    )
}

export default MeetingView
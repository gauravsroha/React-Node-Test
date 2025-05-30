import { useEffect, useState } from 'react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, Flex } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import AddMeeting from './components/Addmeeting';
import CommonDeleteModel from 'components/commonDeleteModel';
import { deleteManyApi } from 'services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const Index = () => {
    const title = "Meeting";
    const navigate = useNavigate()
    const [action, setAction] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedValues, setSelectedValues] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [deleteMany, setDeleteMany] = useState(false);
    const [isLoding, setIsLoding] = useState(false);
    const [data, setData] = useState([]);
    const [permission] = HasAccess(['Meetings'])

    const actionHeader = {
        Header: "Action", 
        isSortable: false, 
        center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign={"center"}>
                <Menu isLazy>
                    <MenuButton><CiMenuKebab /></MenuButton>
                    <MenuList minW={'fit-content'} transform={"translate(1520px, 173px);"}>
                        {permission?.view && (
                            <MenuItem 
                                py={2.5} 
                                color={'green'}
                                onClick={() => navigate(`/metting/${row?.values._id}`)}
                                icon={<ViewIcon fontSize={15} />}
                            >
                                View
                            </MenuItem>
                        )}
                        {permission?.delete && (
                            <MenuItem 
                                py={2.5} 
                                color={'red'} 
                                onClick={() => { 
                                    setDeleteMany(true); 
                                    setSelectedValues([row?.values?._id]); 
                                }} 
                                icon={<DeleteIcon fontSize={15} />}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Text>
        )
    }
    
    const tableColumns = [
        {
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        },
        {
            Header: 'Agenda', 
            accessor: 'agenda', 
            cell: (cell) => (
                <Link to={`/metting/${cell?.row?.values._id}`}> 
                    <Text
                        me="10px"
                        sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}
                        color='brand.600'
                        fontSize="sm"
                        fontWeight="700"
                    >
                        {cell?.value || ' - '}
                    </Text>
                </Link>
            )
        },
        { 
            Header: "Created Date", 
            accessor: "createdDate",
            cell: (cell) => (
                <Text fontSize="sm">
                    {cell?.value ? moment(cell?.value).format('DD-MM-YYYY HH:mm') : '-'}
                </Text>
            )
        },
        { 
            Header: "Time Stamp", 
            accessor: "timestamp",
            cell: (cell) => (
                <Text fontSize="sm">
                    {cell?.value ? moment(cell?.value).format('DD-MM-YYYY HH:mm') : '-'}
                </Text>
            )
        },
        { Header: "Create By", accessor: "createdByName" },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])
    ];

    const fetchData = async () => {
        setIsLoding(true);
        try {
            const result = await getApi('api/meeting');
            
            if (result && result.status === 200) {
                const meetingData = result?.data?.data || result?.data || [];
                setData(Array.isArray(meetingData) ? meetingData : []);
            } else {
                setData([]);
                toast.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching meeting data:", error);
            setData([]);
            toast.error("Failed to fetch data");
        } finally {
            setIsLoding(false);
        }
    };

    const handleDeleteMeeting = async (ids) => {
        try {
            setIsLoding(true);
            
            const payload = { ids: Array.isArray(ids) ? ids : [ids] };
            console.log('Sending delete payload:', payload);
            
            let response = await deleteManyApi('api/meeting/deleteMany', payload);
            
            if (response && response.status === 200) {
                toast.success('Meeting(s) deleted successfully');
                setSelectedValues([]);
                setDeleteMany(false);
                fetchData();
            } else {
                toast.error('Failed to delete meeting(s)');
            }
        } catch (error) {
            console.error("Error deleting meetings:", error);
            toast.error('Failed to delete meeting(s)');
        } finally {
            setIsLoding(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [action]);

    const renderContent = () => {
        if (isLoding) {
            return (
                <Flex justifyContent="center" alignItems="center" height="200px">
                    <Text>Loading...</Text>
                </Flex>
            );
        }
        
        return (
            <CommonCheckTable
                title={title}
                isLoding={isLoding}
                columnData={tableColumns ?? []}
                allData={data ?? []}
                tableData={data}
                tableCustomFields={[]}
                access={permission}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
            />
        );
    };

    return (
        <div>
            {renderContent()}

            <AddMeeting 
                setAction={setAction} 
                isOpen={isOpen} 
                onClose={onClose} 
                fetchData={fetchData} 
            />

            <CommonDeleteModel 
                isOpen={deleteMany} 
                onClose={() => setDeleteMany(false)} 
                type='Meetings' 
                handleDeleteData={handleDeleteMeeting} 
                ids={selectedValues} 
            />
        </div>
    );
};

export default Index;
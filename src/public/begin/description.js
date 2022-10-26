import { useNavigate, useLocation } from 'react-router-dom';
import { Begin } from '../../components/card/begin'
import { FaSwimmingPool } from 'react-icons/fa'
import { MdOutlineHotTub, MdOutlineKitchen, MdBalcony } from 'react-icons/md'
import { GiBarbecue, GiBrasero, GiChimney, GiWifiRouter } from 'react-icons/gi'
import { CgSmartHomeWashMachine } from 'react-icons/cg'
import { IoWifi, IoTvOutline } from 'react-icons/io5'
import { TbSportBillard, TbParking, TbParkingOff, TbWorldUpload } from 'react-icons/tb'
import { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react'
import Page from '../../mockup/page';
import { Incrementor } from '../../components/incrementor/incrementor';
import useDocumentTitle from '../../services/TabTitle';

export default function Application(){

    useDocumentTitle('Rediger une description à votre logement - Airloc')

    const navigate = useNavigate()

    const step = 7
    const maxStep = 7

    const onNext = () => {

    }

    let [description, setDescription] = useState('')

    const handleChange = ({currentTarget}) => {
        if(currentTarget.value.length <= 500){
            setDescription(currentTarget.value);
        }
    };


    return(
        <>
                <Begin title={"Passons maintenant à la description de votre logement"} onNext={()=>navigate('/begin/price')} onPrev={()=>navigate(-1)} topBar={true} bottomBar={true} progressPercentage={(step / maxStep)*100}>
                    <div className='flex flex-col justify-center px-44 py-10 animate-showin w-full h-full overflow-y-auto'>

                        <div className="font-semibold text-2xl pb-1">Créez votre description</div>
                        <div className="text-base font-light text-gray-600 pb-6">La description de votre annonce doit mettre en valeur ce qui fait la particularité de votre logement.</div>
                        <div>
                            <textarea onChange={handleChange} className="animation duration-200 px-5 py-4 border-none rounded-xl focus:outline-none ring-gray-400 ring-1 focus:ring-2 focus:ring-black focus:outline-transparent w-full font-medium text-3xl text-gray-800 h-40" value={description}></textarea>
                            <div className="pt-2 text-sm text-gray-500 font-bold">{description.length}/500</div>
                        </div>

                    </div>
                </Begin>
        </>
    )

}
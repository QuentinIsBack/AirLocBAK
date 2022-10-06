import React, { useContext, useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';

// Components
import NavBar from '../components/navbar/navbar'
import Footer from '../components/footer/footer'

// Firebase
import{ db } from "../firebase.config"
import { doc, getDoc, getDocs, onSnapshot, collection } from "firebase/firestore";
import { UserContext } from '../context/UserContext';

// Icons
import { IoFilter, IoChevronBack } from "react-icons/io5";
import { Button } from '../components/button/button';

import Map, { GeolocateControl, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Page() {
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState();

    const defaultProps = {
        longitude: -1.546979,
        latitude: 47.220220,
        zoom: 15,
    };

    const [home, setHome] = useState([])
    useEffect(() => {

        let unsubscribed = false;

        getDocs(collection(db, "homes"))
          .then((querySnapshot) => {
            if (unsubscribed) return; // unsubscribed? do nothing.
            
            const newUserDataArray = querySnapshot.docs
              .map((doc) => ({ ...doc.data(), id: doc.id }));
      
            setHome(newUserDataArray);
          })
          .catch((err) => {
            if (unsubscribed) return; // unsubscribed? do nothing.
      
            // TODO: Handle errors
            console.error("Failed to retrieve data", err);
          });
      
        return () => unsubscribed  = true;

    }, [])

    return (
        <>  
            <div className={'flex flex-col h-screen'}>
                <div className={"flex-none"}><NavBar /></div>

                <div className={'flex-grow grid grid-cols-12'}>
                    {/* Left Side */}
                    <div className={'col-span-4'}>
                        <div className={'border-r w-full h-full overflow-y-auto p-6 overflow-hidden'}>
                            <div className={'flex flex-row items-center justify-between'}>            
                                <div>
                                    <div className='text-base font-semibold text-night text-start antialiased'>{home.length} logements</div>
                                    <div className='text-xs font-normal text-stone-500 text-start antialiased'>Classements des résultats</div>
                                </div>
                                <Button additionnal={'flex items-center'} theme={'white-outline'} type={'small'}><IoFilter /><div className='ml-2 text-sm font-semibold'>Filtres</div></Button>
                            </div>
                            <div className={'pt-6 grid grid-cols-2 gap-5'}>
                                {home.map(o => 
                                    <a onClick={() => navigate('../homes/'+o.id)}  className={'cursor-pointer z-50 bg-white overflow-hidden w-full'}>
                                        <div className='h-56 w-full bg-cover rounded-xl' style={{backgroundImage: `url(${o.pic1})`}} />
                                        <div className='py-4 w-full flex flex-col space-y-0.25'>
                                            <div className='flex flex-row items-center justify-between antialiased truncate'>
                                                <div className='text-sm font-medium text-black antialiased truncate mr-2'>
                                                    {o.name}
                                                </div>
                                                <div className='text-sm font-normal text-black antialiased'>
                                                    4,25 (65)
                                                </div>
                                            </div>
                                            <div className='text-sm font-normal text-stone-500 antialiased truncate'>
                                                {o.rooms || o.chambers || o.spaces ?
                                                    <div className='flex dot-separator-6'>
                                                        {o.rooms ? <span>Pièces {o.rooms}</span> : undefined}
                                                        {o.chambers ? <span>Chambres {o.chambers}</span> : undefined}
                                                        {o.spaces ? <span>{o.spaces}m<sup>2</sup></span> : undefined}
                                                    </div>
                                                : undefined} 
                                            </div>
                                            <div className='flex flex-row items-center antialiased space-x-1'>
                                                <div className='text-sm font-medium text-black '>{o.price} €</div>
                                                <div className='text-sm font-normal text-night'>par mois</div>
                                                <div className='text-sm font-normal text-stone-500'> · Dès maintenant</div>
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className={'col-span-8'}>   
                        <div className={'border-r w-full h-full overflow-y-auto'}>
                            <div className={'h-full w-full'}>
                                <Map mapboxAccessToken="pk.eyJ1IjoicXVlbnRpbnQiLCJhIjoiY2w4dGM5a3UwMDYwbTNvcXRsbWQyZXRtMSJ9.2IieorABrDO3bK9baO6vvg" initialViewState={defaultProps} mapStyle="mapbox://styles/quentint/cl8tcc2h2007o14qgzjwt7f1q">
                                    <div className='absolute z-10 w-full p-6'>
                                        <div className='flex flex-row space-x-3'>
                                            <div className='cursor-pointer flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 h-10 w-10 shadow-dropdown'>
                                                <IoChevronBack className='mr-0.5' size={20} />
                                            </div>
                                            <div className='cursor-pointer flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 h-10 w-fit px-4 shadow-dropdown'>
                                                    Rechercher
                                            </div>
                                        </div>
                                    </div>
                                    {home.map(o => 
                                        <Marker className={'bg-red-500'} longitude={o.localisation[0]} latitude={o.localisation[1]} anchor="top">
                                            <div className={`flex flex-col items-center justify-center ${showPopup == o.id ? 'z-50' : 'z-10'}`}>
                                                <button onClick={()=> setShowPopup(o.id)} className={`${showPopup == o.id ? 'bg-black text-white' : 'bg-white text-black'} text-sm font-semibold antialiased transform-gpu rounded-xl h-fit w-fit shadow transition duration-300 scale-100 hover:scale-110`}>
                                                    <div className={'px-2 py-1'}>{o.price} €</div>
                                                </button>
                                                {showPopup == o.id && (
                                                    <div onClick={() => navigate('../homes/'+o.id)}  className={`${showPopup == o.id ? 'z-10' : 'z-50'} mt-6 rounded-xl bg-white overflow-hidden shadow-dropdown`}>
                                                        <div className='h-44 w-80 bg-cover' style={{backgroundImage: `url(${o.pic1})`}} />
                                                        <div className='p-4 w-80 flex flex-col space-y-0.25'>
                                                            <div className='flex flex-row items-center justify-between antialiased truncate'>
                                                                <div className='text-base font-medium text-black antialiased truncate mr-2'>
                                                                    {o.name}
                                                                </div>
                                                                <div className='text-base font-normal text-black antialiased'>
                                                                    4,25 (65)
                                                                </div>
                                                            </div>
                                                            <div className='text-base font-normal text-stone-500 antialiased truncate'>
                                                                {o.rooms || o.chambers || o.spaces ?
                                                                    <div className='flex dot-separator-6'>
                                                                        {o.rooms ? <span>Pièces {o.rooms}</span> : undefined}
                                                                        {o.chambers ? <span>Chambres {o.chambers}</span> : undefined}
                                                                        {o.spaces ? <span>{o.spaces}m<sup>2</sup></span> : undefined}
                                                                    </div>
                                                                : undefined} 
                                                            </div>
                                                            <div className='flex flex-row items-center antialiased space-x-1'>
                                                                <div className='text-base font-medium text-black '>{o.price} €</div>
                                                                <div className='text-base font-normal text-night'>par mois</div>
                                                                <div className='text-base font-normal text-stone-500'> · Dès maintenant</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>      
                                        </Marker>
                                    )}
                                </Map>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"flex-none"}><Footer formatage={"sticky"} /></div>
            </div>

        </>
    )
} 

{/*

<div className='border-2 border-transparent hover:border-black rounded-2xl bg-stone-100 w-full h-44 grid grid-cols-2 gap-10 overflow-hidden p-4'>
                                        <div>
                                            <div className='rounded-xl h-full w-full bg-cover' style={{backgroundImage: `url(${o.pic1})`}} />
                                        </div>
                                        <div className='flex flex-col justify-between'>
                                            <div className={`text-black text-md font-semibold antialiased`}>
                                                {o.name}
                                                <div className={`text-stone-600 text-xs font-semibold leading-snug antialiased`}>
                                                    {o.rooms || o.chambers || o.spaces ?
                                                        <div className='flex dot-separator-6'>
                                                            {o.rooms ? <span>Pièces {o.rooms}</span> : undefined}
                                                            {o.chambers ? <span>Chambres {o.chambers}</span> : undefined}
                                                            {o.spaces ? <span>{o.spaces}m<sup>2</sup></span> : undefined}
                                                        </div>
                                                    : undefined}    
                                                </div>
                                            </div>

                                            <div className={`text-stone-600 text-xs font-semibold leading-snug antialiased`}>
                                                Date de disponibilité : Dès maintenant    
                                            </div>
                                            
                                            <div className='flex flex-row justify-between items-center'>
                                                <div className='text-black font-medium text-sm w-20 leading-snug antialiased'>Loyer</div>
                                                <div className='text-black font-bold text-lg antialiased'>{o.price}€</div>
                                            </div>
                                        </div>
                                    </div>

<div onClick={() => navigate('../homes/'+o.id)}  className={'z-50 mt-6 rounded-xl bg-white overflow-hidden shadow-dropdown'}>
                                                            <div className='h-44 w-72 bg-cover' style={{backgroundImage: `url(${o.pic1})`}} />
                                                            <div className='p-4 w-72 flex flex-col space-y-0.25'>
                                                                <div className='flex flex-row items-center justify-between antialiased truncate'>
                                                                    <div className='text-sm font-medium text-black antialiased truncate mr-2'>
                                                                        {o.name}
                                                                    </div>
                                                                    <div className='text-sm font-normal text-black antialiased'>
                                                                        4,25 (65)
                                                                    </div>
                                                                </div>
                                                                <div className='text-sm font-normal text-stone-500 antialiased truncate'>
                                                                    {o.rooms || o.chambers || o.spaces ?
                                                                        <div className='flex dot-separator-6'>
                                                                            {o.rooms ? <span>Pièces {o.rooms}</span> : undefined}
                                                                            {o.chambers ? <span>Chambres {o.chambers}</span> : undefined}
                                                                            {o.spaces ? <span>{o.spaces}m<sup>2</sup></span> : undefined}
                                                                        </div>
                                                                    : undefined} 
                                                                </div>
                                                                <div className='flex flex-row items-center antialiased space-x-1'>
                                                                    <div className='text-sm font-medium text-black'>{o.price} €</div>
                                                                    <div className='text-sm font-normal text-stone-800'>par mois</div>
                                                                    <div className='text-sm font-normal text-stone-500'> · Dès maintenant</div>
                                                                </div>
                                                            </div>
                                                        </div>

*/}
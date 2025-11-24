import React from 'react'
import { Link } from 'react-router-dom';
import notification from './notification';

export default function header() {
  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">DermaScan+ Admin Dashboard</h1>
        {notification()}
    </div>
  )
}

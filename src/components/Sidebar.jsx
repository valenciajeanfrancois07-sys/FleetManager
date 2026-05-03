import { Link } from 'react-router-dom';
export default function Sidebar(){return <aside className='sidebar'>
<h2>FleetManager</h2>
<Link to='/dashboard'>Dashboard</Link>
<Link to='/vehicules'>Véhicules</Link>
<Link to='/materiels'>Matériels</Link>
<Link to='/historiques'>Historique</Link>
</aside>}
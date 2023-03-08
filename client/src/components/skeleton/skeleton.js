import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './skeleton.css'


export default function SkeletonComponent(){

return(
    <div className='skeleton'>
        <div className='left'>
            <Skeleton circle width={46} height={46} baseColor={'aquamarine'}/>
        </div>
        <div className='right'>
            <Skeleton baseColor='aquamarine' style={{marginTop:'10px', marginBottom:'10px'}} height={200}/>
            <Skeleton baseColor='aquamarine' style={{marginTop:'5px'}} count={2} height={10}/>
        </div>
    </div>
)





}
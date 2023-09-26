import ActivityCard from "~/components/card/ActivityCard";
import FetchingComponent from '~/components/loading/Fetching';
import AkaLayout from "~/layouts/AkaLayout";
import { api } from '~/utils/api';

const KegiatanAngkatan = () => {
  const getActivities = api.activity.getActivities.useQuery();
  return (
    <AkaLayout title="Kegiatan Angkatan" activeKey="Kegiatan Angkatan">
      <FetchingComponent
        {...getActivities}
        noData={getActivities.data?.length === 0}
      >
        {getActivities.data?.map((item, index) => (
          <ActivityCard
            id={item.id}
            key={index}
            title={item.title}
            filePath={item.filePath}
            content={item.content}
            startTime={item.startTime}
            endTime={item.endTime}
            kuorum={item.kuorum}
            present={0}
            location={item.location}
          />
        ))}
      </FetchingComponent>
    </AkaLayout>
  );
};

export default KegiatanAngkatan;

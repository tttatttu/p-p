import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text, TextSize } from '@/shared/ui/Text/Text';

import { VStack } from '@/shared/ui/Stack';
import { ArticleList } from '@/entities/Article/ui/ArticleList/ArticleList';
import {
    useArticleRecommendationsList,
} from '../../api/aritcleRecommendationsApi';

interface ArticleRecommendationsListProps {
    className?: string;
}

export const ArticleRecommendationsList = memo(({ className }: ArticleRecommendationsListProps) => {
    const { t } = useTranslation();
    const { isLoading, data: articles, error } = useArticleRecommendationsList(3);

    if (isLoading || error || !articles) {
        return null;
    }

    return (
        <VStack gap="8" className={classNames('', {}, [className])}>
            <Text
                size={TextSize.L}
                title={t('Рекомендуем')}
            />
            <ArticleList
                articles={articles}
                target="_blank"
            />
        </VStack>
    );
});

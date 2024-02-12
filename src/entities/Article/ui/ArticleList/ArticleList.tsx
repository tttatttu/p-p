import React, {
    useEffect,
    HTMLAttributeAnchorTarget, memo, useRef, useState, FC,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text, TextSize } from '@/shared/ui/Text';
import { ARTICLE_LIST_ITEM_LOCALSTORAGE_IDX } from '@/shared/const/localstorage';
import { ArticleView } from '../../model/consts/articleConsts';
import { ArticleListItemSkeleton } from '../ArticleListItem/ArticleListItemSkeleton';
import { ArticleListItem } from '../ArticleListItem/ArticleListItem';
import cls from './ArticleList.module.scss';
import { Article } from '../../model/types/article';

interface ArticleListProps {
    className?: string;
    articles: Article[]
    isLoading?: boolean;
    target?: HTMLAttributeAnchorTarget;
    view?: ArticleView;
    onLoadNextPart?: ()=> void,
}

// const Header = () => <ArticlesPageFilters />;

const getSkeletons = () => new Array(3).fill(0).map((_, index) => (
    <ArticleListItemSkeleton key={index} view={ArticleView.BIG} className={cls.card} />
));

export const ArticleList = memo(({
    className,
    articles,
    view = ArticleView.SMALL,
    isLoading,
    target,
    onLoadNextPart,
}: ArticleListProps) => {
    const { t } = useTranslation();
    const [selectedArticleId, setSelectedArticleId] = useState(1);
    const virtuosoGridRef = useRef<VirtuosoGridHandle>(null);

    useEffect(() => {
        const paged = sessionStorage.getItem(ARTICLE_LIST_ITEM_LOCALSTORAGE_IDX) || 1;
        setSelectedArticleId(+paged);

        return () => sessionStorage.removeItem(ARTICLE_LIST_ITEM_LOCALSTORAGE_IDX);
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (view === ArticleView.SMALL) {
            timeoutId = setTimeout(() => {
                if (virtuosoGridRef.current) {
                    virtuosoGridRef.current.scrollToIndex(selectedArticleId);
                }
            }, 100);
        }
        return () => clearTimeout(timeoutId);
    }, [selectedArticleId, view]);

    const renderArticle = (index: number, article: Article) => (
        <ArticleListItem
            article={article}
            view={view}
            className={cls.card}
            key={article.id}
            target={target}
            index={index}
        />
    );

    const Footer = memo(() => {
        if (isLoading) {
            return (
                <div className={cls.skeleton}>
                    {getSkeletons()}
                </div>
            );
        }
        return null;
    });

    if (!isLoading && !articles.length) {
        return (
            <div className={classNames(cls.ArticleList, {}, [className, cls[view]])}>
                <Text size={TextSize.L} title={t('Статьи не найдены')} />
            </div>
        );
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    const ItemContainerComp: FC<{height: number, width: number, index: number}> = (({
        height, width, index,
    }) => {
        return (
            <div className={cls.ItemContainer}>
                <ArticleListItemSkeleton key={index} view={view} className={cls.card} />
            </div>
        );
    });

    return (
        <div className={classNames(cls.ArticleList, {}, [className, cls[view]])}>
            { view === ArticleView.BIG ? (
                <Virtuoso
                    style={{ height: '100%' }}
                    data={articles}
                    itemContent={renderArticle}
                    endReached={onLoadNextPart}
                    initialTopMostItemIndex={selectedArticleId}
                    // components={{ Header, Footer }}
                    components={{ Footer }}
                />
            ) : (
                <VirtuosoGrid
                    ref={virtuosoGridRef}
                    totalCount={articles.length}
                    // components={{ Header, ScrollSeekPlaceholder: ItemContainerComp }}
                    components={{ ScrollSeekPlaceholder: ItemContainerComp }}
                    endReached={onLoadNextPart}
                    data={articles}
                    itemContent={renderArticle}
                    listClassName={cls.itemsWrapper}
                    scrollSeekConfiguration={{
                        enter: (velocity: any) => Math.abs(velocity) > 200,
                        exit: (velocity: any) => Math.abs(velocity) < 30,
                    }}
                />
            )}
        </div>
    );
});
